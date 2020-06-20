require("../config/config.js");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

//estos 2 comandos son middlewares que parsean url-encoded => json
//parsea application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); //.use se usa para definir middlewares
//parsea application/json
app.use(bodyParser.json());

app.get("/usuario", (req, res) => {
  res.json("get Usuario");
});

app.post("/usuario", (req, res) => {
  let body = req.body;
  body.nombre
    ? res.json({ persona: body })
    : res.status(400).json({
        ok: false,
        mensaje: "El nombre es necesario",
      });
});

app.put("/usuario/:id", (req, res) => {
  let id = req.params.id;
  res.json({ id });
});

app.delete("/usuario", (req, res) => {
  res.json("delete Usuario");
});

app.listen(process.env.PORT, () => {
  console.log(`Listen at port ${process.env.PORT}`);
});
