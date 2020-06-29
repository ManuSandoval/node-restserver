const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");//el eslint cree que no lo uso pero si lo utilizo con los process.env

const UsuarioModel = require("../models/Usuario");
const app = express();

app.post("/login", (req, res) => {
  let { password, email } = req.body;
  UsuarioModel.findOne({ email }, (err, usuario) => {
    //error en la bd
    if (err) return res.status(400).json({ auth: false, err });
    //valida email
    if (!usuario)
      return res.status(400).json({
        auth: false,
        message: "(Usuario) y/o Contraseña incorrectos ",
      });
    //valida passw
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword)
      return res.status(400).json({
        auth: false,
        message: "Usuario y/o (Contraseña) incorrectos ",
      });
    //si pasó todas las validaciones genero y devuelvo el token
    let token = jwt.sign({ usuario }, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRES_IN, //30 días
    });//si se mantienen iguales c/u de los parametros del sign => se genera siempre 
    //el mismo token en cada login
    res.json({ auth: true, usuario, token });
  });
});

module.exports = app;
