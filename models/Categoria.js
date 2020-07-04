const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const categoriaSchema = new Schema({
  descripcion: {
    type: String,
    unique: true,
    required: [true, "La descripción es obligatoria"],
  },
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario" },
  estado: {
    type: Boolean,
    default: true,
  },
});

categoriaSchema.plugin(uniqueValidator, {
  message: "El atributo {PATH} debe ser único",
});
module.exports = model("Categoria", categoriaSchema);
