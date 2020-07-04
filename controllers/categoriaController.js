const CategoriaModel = require("../models/Categoria");
const Usuario = require("../models/Usuario");

const getCategorias = async (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const maxRegistros = Number(req.query.maxRegistros) || 100;
  await CategoriaModel.find({ estado: true })
    .sort("descripcion") //ordena
    .populate("usuario", "nombre email") //a partir del campo usuario (idObject) hace un join mostrando nombre & email
    .skip(desde)
    .limit(maxRegistros)
    .exec((err, categoriasBD) => {
      if (err)
        return res.status(500).json({
          ok: false,
          error: err,
        });
      if (categoriasBD) {
        res.json({
          ok: true,
          categorias: categoriasBD,
        });
      } else {
        res.json({
          ok: false,
          error: "No se encontró la categoría",
        });
      }
    });
};

const getUnaCategoria = async (req, res) => {
  await CategoriaModel.findById(req.params.idCategoria)
    .populate("usuario", "nombre email")
    .exec((err, categoriaBD) => {
      if (err)
        return res.status(500).json({
          ok: false,
          error: err,
        });
      if (categoriaBD) {
        res.json({
          ok: true,
          categoria: categoriaBD,
          message: "La categoría ha sido eliminada con éxito",
        });
      } else {
        res.json({
          ok: false,
          error: "No se encontró la categoría",
        });
      }
    });
};

const postCategoria = async (req, res) => {
  const { email } = req.usuario;
  const { descripcion } = req.body;
  await Usuario.findOne({ email }, (err, usuarioBD) => {
    if (err)
      return res.status(500).json({
        ok: false,
        error: err,
      });
    if (usuarioBD) {
      new CategoriaModel({
        descripcion,
        usuario: usuarioBD,
      }).save((err, categoriaNuevaBD) => {
        if (err)
          return res.status(500).json({
            ok: false,
            err,
          });
        if (categoriaNuevaBD) {
          res.json({
            ok: true,
            categoriaNueva: categoriaNuevaBD,
          });
        } else {
          res.json({
            ok: false,
            error: "No se encontró la categoría",
          });
        }
      });
    }
  });
};

const putCategoria = async (req, res) => {
  const categoriaActualizada = {
    descripcion: req.body["descripcion"],
    usuario: req.usuario._id,
  };
  CategoriaModel.findByIdAndUpdate(
    req.params.idCategoria,
    categoriaActualizada,
    { new: true, runValidators: true, context: "query" },
    (err, categoriaActualizadaBD) => {
      if (err)
        return res.status(500).json({
          ok: false,
          error: err,
        });
      if (categoriaActualizadaBD) {
        res.json({
          ok: true,
          categoria_actualizada: categoriaActualizadaBD,
        });
      } else {
        res.json({
          ok: false,
          error: "No se encontró la categoría",
        });
      }
    }
  );
};

const deleteCategoria = async (req, res) => {
  const cambioEstado = false;
  CategoriaModel.findByIdAndUpdate(
    req.params.idCategoria,
    { estado: cambioEstado },
    { new: true },
    (err, categoriaEliminadaBD) => {
      if (err)
        return res.status(500).json({
          ok: false,
          error: err,
        });
      if (categoriaEliminadaBD) {
        res.json({
          ok: true,
          categoria_eliminada: categoriaEliminadaBD,
        });
      } else {
        res.json({
          ok: false,
          error: "No se encontró la categoría",
        });
      }
    }
  );
};

module.exports = {
  getCategorias,
  getUnaCategoria,
  postCategoria,
  putCategoria,
  deleteCategoria,
};
