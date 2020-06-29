const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");
const {
  verificarToken,
  verificarAdminRole,
} = require("../middlewares/autenticacion");

app.get("/usuario", verificarToken, (req, res) => {
  let desde = Number(req.query.desde) || 0; //NO OLVIDAR CONVERTIR A NUMERO
  let maxRegistros = Number(req.query.maxRegistros) || 5;

  //en el find aclaro los atributos que tiene que devolver
  //el exec ejecuta la query
  Usuario.find({ estado: true }, "nombre email role estado google img")
    .skip(desde)
    .limit(maxRegistros)
    .exec((error, usuariosBD) => {
      if (usuariosBD) {
        Usuario.countDocuments({ estado: true }, (error, cuenta) => {
          res.json({
            ok: true,
            cuenta,
            usuariosBD,
          });
        });
      } else if (error) {
        res.status(400).json({
          ok: false,
          error,
        });
      }
    });
});

app.post("/usuario", [verificarToken, verificarAdminRole], async (req, res) => {
  let { nombre, email, password, role } = req.body;
  let usuarioNuevo = new Usuario({
    nombre,
    email,
    password: bcrypt.hashSync(password, 10),
    role,
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
});

app.put("/usuario/:id", verificarToken, (req, res) => {
  const { nombre, email, img, role, estado = true } = req.body;
  const usuarioActualizado = {
    nombre,
    email,
    img,
    role,
    estado,
  };
  Usuario.findByIdAndUpdate(
    req.params.id, //id
    usuarioActualizado, //cuerpo
    { new: true, runValidators: true, context: "query" }, //devuelve el objeto actualizado, y corre
    //las validaciones del modelo antes de actualizar porque el mongoose no lo hace en el put parece
    //runsValidators y context van juntos, sino falla el unique-validator y da error de "owner-document"
    (error, usuarioBD) => {
      usuarioBD
        ? res.json({ ok: true, usuario: usuarioBD })
        : res.json({ ok: false, error });
    }
  );
});

app.delete(
  "/usuario/:id",
  [verificarToken, verificarAdminRole],
  async (req, res) => {
    let cambioEstado = false;
    await Usuario.findByIdAndUpdate(
      req.params.id,
      { estado: cambioEstado },
      { new: true },
      (error, usuarioEliminado) => {
        usuarioEliminado
          ? res.json({
              ok: true,
              usuarioEliminado,
            })
          : res.status(400).json({
              ok: false,
              error: {
                message: error || "No se encontró un usuario con ese id",
              },
            });
      }
    );
  }
);

module.exports = app;
