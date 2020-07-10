const express = require("express");
const app = express();
const { Router } = require("express");
const router = Router();
const fileUpload = require("express-fileupload");
const { uploadImg, getImg } = require("../controllers/imageController");
const { verificarToken } = require("../middlewares/autenticacion");

app.use(fileUpload({ useTempFiles: true }));

router.route("/:imgType/:fileName").get(verificarToken, getImg);

router.route("/:imgType/:id").put(uploadImg);

module.exports = router;
