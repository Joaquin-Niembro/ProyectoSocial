const express = require("express");
const router = express.Router();
const { jwtGenerator } = require("../../utils");
const { query } = require("../../database");

router.get("/", async (req, res) => {
  const response = {
    sections: ["Proyectos", "Estudiantes", "Profesores"],
  };
  return res.send(response);
});

router.get("/estudiantes", async (req, res) => {
  try {
    const estudiantes = await query(`SELECT * from persona where rol = ?`, [
      "Estudiante",
    ]);
    const compEstudiante = await query(`SELECT * from estudiante`, [
      "Estudiante",
    ]);
    if (estudiantes.length) {
      let merge = [];
      if (compEstudiante.length) {
        estudiantes.forEach((person) => {
          const id = person.ID_persona;
          compEstudiante.forEach((x) => {
            if (id === x.id_estudiante) {
              merge.push({ ...person, ...x, ...{ id_persona: null } });
            }
          });
        });
      }

      return res.send(merge).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.get("/programas", async (req, res) => {
  try {
    const programas = await query(`SELECT * from programa`);

    if (programas.length) {
      return res.send(programas).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.post("/programas", async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    await query(
      `UPDATE programa SET nombrecompleto=?, clave_plan=?, nombrecorto=?, referencia_snp=?, estado=? WHERE id_programa=?`,
      [
        body.nombrecompleto,
        body.clave_plan,
        body.nombrecorto,
        body.referencia_snp,
        body.estado,
        body.id_programa,
      ]
    );
    const programas = await query(`SELECT * from programa`);
    if (programas.length) {
      return res.send(programas).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.post("/programas/crear", async (req, res) => {
  try {
    const body = req.body;

    await query(
      `INSERT into programa (nombrecompleto, clave_plan, nombrecorto, referencia_snp, estado) VALUES (?,?,?,?,?)`,
      [
        body.nombrecompleto,
        body.clave_plan,
        body.nombrecorto,
        body.referencia_snp,
        body.estado,
      ]
    );
    const programas = await query(`SELECT * from programa`);
    if (programas.length) {
      return res.send(programas).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.get("/lgacs", async (req, res) => {
  try {
    const lgacs = await query(`SELECT * from lgac`);

    if (lgacs.length) {
      return res.send(lgacs).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.post("/lgacs", async (req, res) => {
  try {
    const body = req.body;

    await query(
      `UPDATE lgac SET nombre=?, clave=?, fecha_inicio=?, fecha_fin=?, lgac_programa=? WHERE id_lgac=?`,
      [
        body.nombre,
        body.clave,
        body.fecha_inicio.split("T")[0],
        body.fecha_fin.split("T")[0],
        parseInt(body.lgac_programa),
        body.id_lgac,
      ]
    );
    const lgacs = await query(`SELECT * from lgac`);
    if (lgacs.length) {
      return res.send(lgacs).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.post("/lgacs/crear", async (req, res) => {
  try {
    const body = req.body;

    await query(
      `INSERT into lgac  (nombre, clave, fecha_inicio, fecha_fin, lgac_programa) VALUES (?,?,?,?,?) `,
      [
        body.nombre,
        body.clave,
        body.fecha_inicio.split("T")[0],
        body.fecha_fin.split("T")[0],
        body.lgac_programa,
        body.id_lgac,
      ]
    );
    const lgacs = await query(`SELECT * from lgac`);
    if (lgacs.length) {
      return res.send(lgacs).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.post("/estudiantes", async (req, res) => {
  try {
    const body = req.body;

    await query(
      `UPDATE persona SET nombres=?, apaterno=?, amaterno=?, usuario=?, cvu_conacyt=?, tiempo_dedicacion=?, estado=?, id_programa=? WHERE ID_persona=?`,
      [
        body.nombres,
        body.apaterno,
        body.amaterno,
        body.usuario,
        body.cvu_conacyt,
        body.tiempo_dedicacion,
        body.estado,
        parseInt(body.id_programa),
        body.ID_persona,
      ]
    );
    const estudiantes = await query(`SELECT * from persona where rol = ?`, [
      "Estudiante",
    ]);
    if (estudiantes.length) {
      return res.send(estudiantes).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.post("/estudiantes/crear", async (req, res) => {
  try {
    const body = req.body;
    console.log(body);

    const { insertId } = await query(
      `INSERT into persona (nombres, apaterno, amaterno, usuario, cvu_conacyt, tiempo_dedicacion, estado, rol, contrasenia)
      VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        body.nombres,
        body.apaterno,
        body.amaterno,
        body.usuario,
        body.cvu_conacyt,
        body.tiempo_dedicacion,
        body.estado,
        "Estudiante",
        " ",
      ]
    );
    await query(
      `INSERT into estudiante (id_estudiante, numcontrol, cohorte, curp, correopersonal, correoinstitucional,
        instit_procedencia, numero_beca, estado_beca, fecha_obt_grado, estado, id_persona, inicio_beca, termino_beca)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        insertId,
        body.numcontrol,
        body.cohorte,
        body.curp,
        body.correopersonal,
        body.correoinstitucional,
        body.instit_procedencia,
        body.numero_beca,
        body.estado_beca,
        body.fecha_obt_grado,
        "ACTIVO",
        insertId,
        body.inicio_beca,
        body.termino_beca,
      ]
    );
    const estudiantes = await query(`SELECT * from persona where rol = ?`, [
      "Estudiante",
    ]);
    if (estudiantes.length) {
      return res.send(estudiantes).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.get("/profesores", async (req, res) => {
  try {
    const profesores = await query(`SELECT * from persona where rol = ?`, [
      "Profesor",
    ]);
    if (profesores.length) {
      const copy = profesores.map((x) => ({ ...x, contrasenia: null }));
      const compProfesor = await query(`SELECT * from profesor`);

      let merge = [];
      if (compProfesor.length) {
        copy.forEach((person) => {
          const id = person.ID_persona;
          compProfesor.forEach((x) => {
            if (id === x.id_profesor) {
              merge.push({
                ...person,
                ...x,
                ...{ id_profesor: null, id_persona: null },
              });
            }
          });
        });
      }
      return res.send(merge).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.post("/profesores", async (req, res) => {
  try {
    const body = req.body;

    await query(
      `UPDATE persona SET nombres=?, apaterno=?, amaterno=?, usuario=?, cvu_conacyt=?, tiempo_dedicacion=?, estado=?, id_programa=? WHERE ID_persona=?`,
      [
        body.nombres,
        body.apaterno,
        body.amaterno,
        body.usuario,
        body.cvu_conacyt,
        body.tiempo_dedicacion,
        body.estado,
        parseInt(body.id_programa),
        body.ID_persona,
      ]
    );
    const profesores = await query(`SELECT * from persona where rol = ?`, [
      "Profesor",
    ]);
    if (profesores.length) {
      return res.send(profesores).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.post("/profesores/crear", async (req, res) => {
  try {
    const body = req.body;

    const { insertId } = await query(
      `INSERT into persona (nombres, apaterno, amaterno, usuario, cvu_conacyt, tiempo_dedicacion, estado, rol, contrasenia)
      VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        body.nombres,
        body.apaterno,
        body.amaterno,
        body.usuario,
        body.cvu_conacyt,
        body.tiempo_dedicacion,
        body.estado,
        "Profesor",
        body.contrasenia,
      ]
    );
    await query(
      `INSERT into profesor (id_profesor, fecha_alta, fecha_baja, tipo, estado, id_persona)
        VALUES (?,?,?,?,?,?)`,
      [
        insertId,
        body.fecha_alta.split("T")[0],
        body.fecha_baja.split("T")[0],
        body.tipo,
        1,
        insertId,
      ]
    );
    const profesores = await query(`SELECT * from persona where rol = ?`, [
      "Profesor",
    ]);
    if (profesores.length) {
      return res.send(profesores).status(200);
    }
    //return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.get("/productos", async (req, res) => {
  try {
    const productos = await query(`SELECT * from producto`);
    if (productos.length) {
      return res.send(productos).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.post("/productos", async (req, res) => {
  try {
    const body = req.body;
    await query(`UPDATE producto SET nombre=?, estado=? WHERE id_producto=?`, [
      body.nombre,
      body.estado,
      body.id_producto,
    ]);
    const productos = await query(`SELECT * from producto`);
    if (productos.length) {
      return res.send(productos).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.post("/productos/crear", async (req, res) => {
  try {
    const body = req.body;
    await query(`INSERT into producto (nombre, estado) VALUES (? , ?)`, [
      body.nombre,
      body.estado,
    ]);
    const productos = await query(`SELECT * from producto`);
    if (productos.length) {
      return res.send(productos).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.get("/proyectos", async (req, res) => {
  try {
    const proyectos = await query(`SELECT * from proyecto`);

    if (proyectos.length) {
      return res.send(proyectos).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});
router.get("/estudiantes-programa", async (req, res) => {
  try {
    const estudiantes = await query(`SELECT * from persona where rol = ?`, [
      "Estudiante",
    ]);
    const programas = await query(`SELECT * from programa`);
    for (let i = 0; i < estudiantes.length; i++) {
      const programa = estudiantes[i].id_programa;
      estudiantes[i].programa = programas.filter(
        (y) => parseInt(y.id_programa) === parseInt(programa)
      )[0].nombrecompleto;
    }
    const compEstudiante = await query(`SELECT * from estudiante`, [
      "Estudiante",
    ]);

    let merge = [];
    if (compEstudiante.length) {
      estudiantes.forEach((person) => {
        const id = person.ID_persona;
        compEstudiante.forEach((x) => {
          if (id === x.id_estudiante) {
            merge.push({ ...person, ...x, ...{ id_persona: null } });
          }
        });
      });
    }
    return res.send(merge).status(200);
  } catch (error) {
    console.error(error);
  }
});
router.get("/profesores-programa", async (req, res) => {
  try {
    const profesores = await query(`SELECT * from persona where rol = ?`, [
      "Profesor",
    ]);
    const programas = await query(`SELECT * from programa`);
    for (let i = 0; i < profesores.length; i++) {
      const programa = profesores[i].id_programa;
      profesores[i].programa = programas.filter(
        (y) => parseInt(y.id_programa) === parseInt(programa)
      )[0].nombrecompleto;
    }

    const copy = profesores.map((x) => ({ ...x, contrasenia: null }));
    const compProfesor = await query(`SELECT * from profesor`);

    let merge = [];
    if (compProfesor.length) {
      copy.forEach((person) => {
        const id = person.ID_persona;
        compProfesor.forEach((x) => {
          if (id === x.id_profesor) {
            merge.push({
              ...person,
              ...x,
              ...{ id_profesor: null, id_persona: null },
            });
          }
        });
      });
    }
    return res.send(merge).status(200);
  } catch (error) {
    console.error(error);
  }
});
router.get("/proyectos-organismos", async (req, res) => {
  try {
    const proyectos = await query(`SELECT * from proyecto`);
    const organismos = await query(`SELECT * from organismo`);
    for (let i = 0; i < proyectos.length; i++) {
      const organismo = proyectos[i].id_organismo;
      proyectos[i].organismo = organismos.filter(
        (y) => parseInt(y.id_organismo) === parseInt(organismo)
      )[0].nombre;
    }
    return res.send(proyectos).status(200);
  } catch (error) {
    console.error(error);
  }
});
router.post("/proyectos", async (req, res) => {
  try {
    const body = req.body;

    await query(
      `UPDATE proyecto SET nombre=?, objetivo=?, descripcion=?, fecha_ingreso_banco=?,
    fecha_inicio=?, mecanismo_vinc=?, estado=?, id_estudiante=?, id_organismo=? WHERE id_proyecto=?`,
      [
        body.nombre,
        body.objetivo,
        body.descripcion,
        body.fecha_ingreso_banco.split("T")[0],
        body.fecha_inicio.split("T")[0],
        body.mecanismo_vinc,
        body.estado,
        parseInt(body.id_estudiante),
        parseInt(body.id_organismo),
        body.id_proyecto,
      ]
    );

    const proyectos = await query(`SELECT * from proyecto`);
    if (proyectos.length) {
      return res.send(proyectos).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.post("/proyectos/crear", async (req, res) => {
  try {
    const body = req.body;

    await query(
      `INSERT INTO proyecto (nombre, objetivo, descripcion, fecha_ingreso_banco,
    fecha_inicio, mecanismo_vinc, estado, id_estudiante, id_organismo) values (?,?,?,?,?,?,?,?,?)`,
      [
        body.nombre,
        body.objetivo,
        body.descripcion,
        body.fecha_ingreso_banco.split("T")[0],
        body.fecha_inicio.split("T")[0],
        body.mecanismo_vinc,
        body.estado,
        body.id_estudiante,
        body.id_organismo,
      ]
    );

    const proyectos = await query(`SELECT * from proyecto`);
    if (proyectos.length) {
      return res.send(proyectos).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.get("/organismos", async (req, res) => {
  try {
    const organismos = await query(`SELECT * from organismo`);

    if (organismos.length) {
      return res.send(organismos).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.post("/organismos", async (req, res) => {
  try {
    const body = req.body;
    console.log(body.id_organismo);
    await query(
      `UPDATE organismo SET nombre=?, sector=?, descripcion=?, fecha_termino=?, fecha_inicio=?, ambito=?, pais=?, entidad_federativa=?, estado=? WHERE id_organismo = ?`,
      [
        body.nombre,
        body.sector,
        body.descripcion,
        body.fecha_termino.split("T")[0],
        body.fecha_inicio.split("T")[0],
        body.ambito,
        body.entidad_federativa,
        body.estado,
        body.id_organismo,
      ]
    );
    const organismos = await query(`SELECT * from organismo`);
    if (organismos.length) {
      return res.send(organismos).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});

router.post("/organismos/crear", async (req, res) => {
  try {
    const body = req.body;

    await query(
      `INSERT into organismo  (nombre, sector, descripcion, 
        fecha_termino, fecha_inicio, ambito, pais, entidad_federativa, estado)
        VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        body.nombre,
        body.sector,
        body.descripcion,
        body.fecha_termino.split("T")[0],
        body.fecha_inicio.split("T")[0],
        body.ambito,
        body.pais,
        body.entidad_federativa,
        body.estado,
      ]
    );
    const organismos = await query(`SELECT * from organismo`);
    if (organismos.length) {
      return res.send(organismos).status(200);
    }
    return res.send([]).status(200);
  } catch (err) {
    console.error(err);
  }
});
module.exports = router;
