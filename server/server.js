require("../config/config.js");

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const bodyParser = require("body-parser");
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

app.use(require("../routes/usuario"));

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
