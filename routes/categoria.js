const { Router } = require("express");
const router = Router();
const {
  verificarToken,
  verificarAdminRole,
} = require("../middlewares/autenticacion");

const {
  getCategorias,
  getUnaCategoria,
  postCategoria,
  putCategoria,
  deleteCategoria,
} = require("../controllers/categoriaController");

router
  .route("/")
  .get([verificarToken], getCategorias)
  .post([verificarToken], postCategoria);

router
  .route("/:idCategoria")
  .get([verificarToken], getUnaCategoria)
  .put([verificarToken], putCategoria)
  .delete([verificarToken, verificarAdminRole], deleteCategoria);

module.exports = router;
