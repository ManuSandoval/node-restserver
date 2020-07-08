const { Router } = require("express");
const router = Router();
const {
  verificarToken,
  verificarAdminRole,
} = require("../middlewares/autenticacion");

const {
  getProductos,
  getUnProducto,
  buscarProductosPorFrase,
  postProducto,
  putProducto,
  deleteProducto,
} = require("../controllers/productoController");

router
  .route("/")
  .get([verificarToken], getProductos)
  .post([verificarToken], postProducto);

router.route("/buscar/:fraseBusqueda").get([verificarToken], buscarProductosPorFrase);

router
  .route("/:idProducto")
  .get([verificarToken], getUnProducto)
  .put([verificarToken], putProducto)
  .delete([verificarToken, verificarAdminRole], deleteProducto);

module.exports = router;
