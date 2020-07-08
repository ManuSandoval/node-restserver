const { Router } = require("express");
const router = Router();
const {
  loginComun,
  loginGoogle,
  registrarUsuarioGoogle,
} = require("../controllers/loginController");
const { verificarTokenGoogle } = require("../middlewares/autenticacion");

router.route("/loginComun").post(loginComun);

router
  .route("/loginGoogle")
  .post([verificarTokenGoogle], loginGoogle, registrarUsuarioGoogle);

module.exports = router;
