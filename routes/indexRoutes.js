const express = require("express");
const app = express();

app.use(require("./login"));
app.use(require("./usuario"));

/* app.use((err, req, res, next) => {
  if (!err) return next();
  // si hay error indicarlo
  res.status(400).json({
    ok: false,
    err: {
      code: 400,
      message: "Peticion no valida",
      err: "BAD_REQUEST",
    },
  });
}); */
module.exports = app;
