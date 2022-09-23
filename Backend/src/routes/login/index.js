const express = require("express");
const router = express.Router();
const { jwtGenerator } = require("../../utils");
const { query } = require("../../database");

router.post("/", async (req, res) => {
  const { usuario, pass } = req.body;
  console.log('cool: ',usuario);
  const user = await query(
    `SELECT * from persona where usuario = ?`,
    [usuario]
  );
  console.log(user)
  if (!user) {
    return res.status(505).send("Not");
  }
  const token = await jwtGenerator(user[0].ID_persona, user[0].rol);
  return res.send({ token });
});

module.exports = router;
