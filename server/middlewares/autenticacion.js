const config = require("../config/config");
const jwt = require("jsonwebtoken");
//LIB DE GOOGLE
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const verificarToken = (req, res, next) => {
  const token = req.params.fileName ? req.query.token : req.get("token");

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, payloadDecoded) => {
      if (err) return res.status(401).json({ auth: false, err });
      //!err => decodifico del token, el usuario que pasé como payload en el sign
      //e inserto en el req al usuario para la proxima función o middleware que lo reciba
      req.usuario = payloadDecoded.usuarioBD;
      next(); //IMPORTANTISIMO QUE SE LLAME DENTRO DEL VERIFY PORQUE SINO SE VA A EJECUTAR EL NEXT AUNQUE TENGA ERRORES
    });
  } else {
    res.status(401).json({
      ok: false,
      message: "Token no válido. Inicie sesión nuevamente.",
    });
  }
};

const verificarAdminRole = (req, res, next) => {
  req.usuario.role === "ADMIN_ROLE"
    ? next()
    : res.status(403).json({
        ok: false,
        message:
          "Error. No posee los permisos necesarios (Admin) para realizar esta acción",
      });
};

const verificarTokenGoogle = async (req, res, next) => {
  let token = await req.body.idtoken;
  const ticket = await client
    .verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    })
    .catch((e) => {
      return res.status(403).json({
        auth: false,
        error: e,
      });
    });
  const { name, email, picture } = ticket.getPayload();
  const usuarioGoogle = {
    nombre: name,
    email,
    img: picture,
    google: true,
  };
  req.usuarioGoogle = usuarioGoogle;
  next();
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
};

module.exports = {
  verificarToken,
  verificarAdminRole,
  verificarTokenGoogle,
};
