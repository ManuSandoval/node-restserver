const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");

const altaUsuario = async (req, res) => {
  let { nombre, email, password = "byGoogle", role, google = false } = req.body;
  let usuarioNuevo = new Usuario({
    nombre,
    email,
    password: bcrypt.hashSync(password, 10),
    role,
    google,
  });
  await usuarioNuevo.save((error, usuarioBD) => {
    usuarioBD
      ? res.json({
          ok: true,
          usuarioBD,
        })
      : res.status(400).json({
          ok: false,
          error,
        });
  });
};

module.exports = {
  altaUsuario,
};
