require("../config/config.js");
const path = require("path"); //sirve para gestionar paths
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

//estos 2 comandos son middlewares que parsean url-encoded => json
//parsea application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); //.use se usa para definir middlewares
//parsea application/json
app.use(bodyParser.json());

//habilito carpeta public para que el navegador pueda encontrar automaticamente el html.
//uso path.resolve para crear el path de la carpeta public, donde __dirname sería la
//dirección del script start (server/server.js).
//Si la carpeta estuviese simplemente dentro del directorio del script start => el comando sería
app.use(express.static(path.resolve(__dirname, "../public")));
//app.use(express.static("public")) ESTO TAMBIÉN FUNCIONA PERO NO SÉ SI PARA TODOS LOS CASOS

//para poder subir archivos (useTempFiles : true, evita que se suban vacíos)
app.use(fileUpload({ useTempFiles: true }));

//conf global de rutas
app.use("/login", require("../routes/login"));
app.use("/categoria", require("../routes/categoria"));
app.use("/producto", require("../routes/producto"));
app.use("/usuario", require("../routes/usuario"));
app.use("/upload", require("../routes/upload"));
//app.use(require("../routes/indexRoutes")); NO ME FUNCIONA => PONGO TODAS LAS RUTAS ACÁ

mongoose.connect(
  process.env.URL_DB, //SI LA BD NO EXISTE LA CREA
  mongooseOptions,
  (err) => {
    err
      ? console.log("La BD no conectó. Verifique que la BD esté up.")
      : console.log("BD ONLINE.");
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Listen at port ${process.env.PORT}`);
});
