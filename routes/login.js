const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config"); //el eslint cree que no lo uso pero si lo utilizo con los process.env
//libreria de google
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const UsuarioModel = require("../models/Usuario");
const app = express();

/* Seguridad en el ID de cliente
0
Jose · Clase 134 · hace 2 meses
Hola Fernando,

Revisando el código del Rest Server que hemos hecho en esta sección junto con google sign-in, veo que en el index.html, realmente queda expuesto a cualquier usuario en los metas el ID de cliente ( google-signin-client_id ). Esto me parece un problema grave de seguridad, ¿Hay otra forma de hacer para que sea seguro? Al final es directamente google el que nos está diciendo que lo hagamos así, pero me gustaría que me dieses tu opinión al respecto.

Gracias de antemano,

Saludos!

1 respuesta
Jose Cardenas
Jose— Profesor asistente 
hace 2 meses
0
Hola Jose.

Así es, en mi opinión google confía en su sistema de autenticación vía correo electrónico para certificar que ciertamente es la persona correcta.

En cuanto a la seguridad de nuestro server, se podría implementar una función que agregue dinámicamente el meta en nuestro index.html y que ClientId provenga del server a través de una peticion http, reforzaría la seguridad con los certificados ssl. */
app.post("/login", (req, res) => {
  let { password, email } = req.body;
  UsuarioModel.findOne({ email }, (err, usuario) => {
    //error en la bd
    if (err) return res.status(400).json({ auth: false, err });
    //valida email
    if (!usuario)
      return res.status(400).json({
        auth: false,
        message: "(Usuario) y/o Contraseña incorrectos ",
      });
    //valida passw
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword)
      return res.status(400).json({
        auth: false,
        message: "Usuario y/o (Contraseña) incorrectos ",
      });
    //si pasó todas las validaciones genero y devuelvo el token
    let token = jwt.sign({ usuario }, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRES_IN, //30 días
    }); //si se mantienen iguales c/u de los parametros del sign => se genera siempre
    //el mismo token en cada login
    res.json({ auth: true, usuario, token });
  });
});

const verify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const { name, email, picture } = ticket.getPayload();
  return {
    nombre: name,
    email,
    img: picture,
    google: true,
  };
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
};

app.post("/google", async (req, res) => {
  let token = await req.body.idtoken;
  const usuarioGoogle = await verify(token).catch((e) => {
    return res.status(403).json({
      auth: false,
      error: e,
    });
  });
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
});

module.exports = app;
