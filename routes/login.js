const { Router } = require("express");
const router = Router();
const { loginComun, loginGoogle } = require("../controllers/loginController");
const { verificarTokenGoogle } = require("../middlewares/autenticacion");
const { altaUsuario } = require("../controllers/usuarioController");

router.route("/loginComun").post(loginComun);

router.route("/loginGoogle").post([verificarTokenGoogle], loginGoogle);

module.exports = router;
