const config = require("../config/config");
const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const token = req.get("token");
  if (token)
    jwt.verify(token, process.env.SECRET_KEY, (err, payloadDecoded) => {
      if (err) return res.status(401).json({ auth: false, err });
      //!err => decodifico del token, el usuario que pasé como payload en el sign
      //e inserto en el req al usuario para la proxima función o middleware que lo reciba
      req.usuario = payloadDecoded.usuario;
      next(); //IMPORTANTISIMO QUE SE LLAME DENTRO DEL VERIFY PORQUE SINO SE VA A EJECUTAR EL NEXT AUNQUE TENGA ERRORES
    });
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

module.exports = {
  verificarToken,
  verificarAdminRole,
};
