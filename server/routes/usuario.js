const { Router } = require("express");
const router = Router();
const {
  verificarToken,
  verificarAdminRole,
} = require("../middlewares/autenticacion");
const {
  getUsuarios,
  crearUsuario,
  modificarUsuario,
  eliminarUsuario,
} = require("../controllers/usuarioController");

router
  .route("/")
  .get([verificarToken], getUsuarios)
  .post([verificarToken, verificarAdminRole], crearUsuario);

router
  .route("/:id")
  .put([verificarToken], modificarUsuario)
  .delete([verificarToken, verificarAdminRole], eliminarUsuario);

module.exports = router; //sin llaves, sino TypeError: Router.use() requires a middleware function but got a Object
