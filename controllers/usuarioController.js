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

const getUsuarios = (req, res) => {
  let desde = Number(req.query.desde) || 0; //NO OLVIDAR CONVERTIR A NUMERO
  let maxRegistros = Number(req.query.maxRegistros) || 100;

  //en el find aclaro los atributos que tiene que devolver
  //el exec ejecuta la query
  Usuario.find({ estado: true }, "nombre email role estado google img")
    .skip(desde)
    .limit(maxRegistros)
    .exec((error, usuariosBD) => {
      if (usuariosBD) {
        Usuario.countDocuments({ estado: true }, (err, cuenta) => {
          if (err)
            return res.status(500).json({
              ok: false,
              error: err,
            });
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
};

const crearUsuario = async (req, res) => {
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
};

const modificarUsuario = (req, res) => {
  const atributosActualizados = req.body;
  Usuario.findByIdAndUpdate(
    req.params.id, //id
    atributosActualizados, //controlar no mandar atributos null. O mando atributos con valores o no directamente no los mando
    { new: true, runValidators: true, context: "query" }, //devuelve el objeto actualizado, y corre
    //las validaciones del modelo antes de actualizar porque el mongoose no lo hace en el put parece
    //runsValidators y context van juntos, sino falla el unique-validator y da error de "owner-document"
    (err, usuarioBD) => {
      if (err)
        return res.status(500).json({
          ok: false,
          error: err,
        });
      usuarioBD
        ? res.json({ ok: true, usuario: usuarioBD })
        : res.json({
            ok: false,
            error: "No se encontró un usuario con ese ID",
          });
    }
  );
};

const eliminarUsuario = async (req, res) => {
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
};

module.exports = {
  altaUsuario,
  getUsuarios,
  crearUsuario,
  modificarUsuario,
  eliminarUsuario,
};
