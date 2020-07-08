const express = require("express");
const app = express();
const { Router } = require("express");
const router = Router();
const fileUpload = require("express-fileupload");
const { uploadImg } = require("../controllers/uploadController");

app.use(fileUpload({ useTempFiles: true }));
router.route("/:type/:id").put(uploadImg);

module.exports = router;
