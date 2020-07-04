const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config"); //el eslint cree que no lo uso pero si lo utilizo con los process.env

const UsuarioModel = require("../models/Usuario");

const loginComun = async (req, res) => {
  let { password, email } = req.body;
  await UsuarioModel.findOne({ email }, (err, usuarioBD) => {
    //error en la bd
    if (err) return res.status(400).json({ auth: false, err });
    //valida email
    if (!usuarioBD)
      return res.status(400).json({
        auth: false,
        message: "(Usuario) y/o Contraseña incorrectos ",
      });
    //valida passw
    const validPassword = bcrypt.compareSync(password, usuarioBD.password);
    if (!validPassword)
      return res.status(400).json({
        auth: false,
        message: "Usuario y/o (Contraseña) incorrectos ",
      });
    //si pasó todas las validaciones genero y devuelvo el token
    let token = jwt.sign({ usuarioBD }, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRES_IN, //30 días
    }); //si se mantienen iguales c/u de los parametros del sign => se genera siempre
    //el mismo token en cada login
    res.json({ auth: true, usuario: usuarioBD, token });
  });
};

const loginGoogle = async (req, res) => {
  const usuarioGoogle = req.usuarioGoogle;
  await UsuarioModel.findOne(
    { email: usuarioGoogle.email },
    (err, usuarioBD) => {
      if (err)
        return res.status(500).json({
          auth: false,
          error: err,
        });
      if (usuarioBD) {
        //existe y se registró con google => le doy un token
        if (usuarioBD.google) {
          let token = jwt.sign({ usuarioBD }, process.env.SECRET_KEY, {
            expiresIn: process.env.EXPIRES_IN,
          });
          return res.json({
            auth: true,
            message: "Usuario logueado",
            usuario: usuarioBD,
            token,
          });
        } else {
          //existe pero no se registró con google
          return res.status(400).json({
            auth: false,
            error: {
              message:
                "Esta cuenta se creó con el proceso de registro  de esta web. Por favor ingrese con su usuario y contraseña",
            },
          });
        }
      } else {
        //no existe y se está registrando con google
        let usuarioNuevo = new UsuarioModel({
          ...usuarioGoogle,
          password: "sinContra", //como se registró con google no va a tener contraseña, entonces pongo una ficticia porque el modelo me lo requiere, pero no la encripto, entonces cuando a la vuelta lo decodifique, no va a matchear.
        });
        usuarioNuevo.save((err, usuarioBD) => {
          if (err)
            return res.status(500).json({
              auth: false,
              err,
            });
          if (usuarioBD) {
            const token = jwt.sign({ usuarioBD }, process.env.SECRET_KEY, {
              expiresIn: process.env.EXPIRES_IN,
            });
            res.json({
              auth: true,
              message: "Usuario registrado y logueado.",
              usuarioBD,
              token,
            });
          }
        });
      }
    }
  );
};

module.exports = {
  loginComun,
  loginGoogle,
};
