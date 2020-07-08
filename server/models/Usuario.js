const { Schema, model } = require("mongoose");
//sirve para enviar errores en el json de respuesta
const uniqueValidator = require("mongoose-unique-validator");

const roles_validos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol válido",
};
const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El Nombre es necesario"],
  },
  email: {
    type: String,
    required: [true, "El correo es necesario"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum: roles_validos, //especifica los valores que puede recibir, arriba está roles_validos
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

//MUY PRACTICO: siempre que devuelve un json se invoca el toJSON => modifico el
//toJSON para que no devuelva el password
usuarioSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

//añado el plugin de error
usuarioSchema.plugin(uniqueValidator, {
  message: "El atributo {PATH} debe ser único",
});

module.exports = model("Usuario", usuarioSchema);
