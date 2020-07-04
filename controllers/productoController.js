const ProductoModel = require("../models/Producto");
const UsuarioModel = require("../models/Usuario");
const CategoriaModel = require("../models/Categoria");

const getProductos = async (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const maxRegistros = Number(req.query.maxRegistros) || 20;
  await ProductoModel.find({ disponible: true })
    .sort("nombre") //ordena
    .populate("usuario", "nombre email") //a partir del campo usuario (idObject) hace un join mostrando nombre & email
    .populate("categoria", "descripcion")
    .skip(desde)
    .limit(maxRegistros)
    .exec((err, productosBD) => {
      if (err)
        return res.status(500).json({
          ok: false,
          err,
        });
      if (productosBD) {
        res.json({
          ok: true,
          Productos: productosBD,
        });
      } else {
        res.json({
          ok: false,
          error: "No se encontró el producto",
        });
      }
    });
};

const getUnProducto = async (req, res) => {
  ProductoModel.findById(req.params.idProducto)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productoBD) => {
      if (err)
        return res.status(500).json({
          ok: false,
          error: err,
        });
      if (productoBD) {
        res.json({
          ok: true,
          Producto: productoBD,
        });
      } else {
        res.json({
          ok: false,
          error: "No se encontró el producto",
        });
      }
    });
};

const buscarProductosPorFrase = async (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const maxRegistros = Number(req.query.maxRegistros) || 5;

  const regex = new RegExp(req.params.fraseBusqueda, "i"); //la "i" es una bandera para decir que no sea caseSensitive

  await ProductoModel.find({ disponible: true, nombre: regex })
    .sort("nombre") //ordena
    .populate("usuario", "nombre email") //a partir del campo usuario (idObject) hace un join mostrando nombre & email
    .populate("categoria", "descripcion")
    .skip(desde)
    .limit(maxRegistros)
    .exec((err, productosBD) => {
      if (err)
        return res.status(500).json({
          ok: false,
          err,
        });
      if (productosBD) {
        res.json({
          ok: true,
          Productos: productosBD,
        });
      } else {
        res.json({
          ok: false,
          error: "No se encontró ningún producto con ese nombre",
        });
      }
    });
};

const postProducto = async (req, res) => {
  const usuario = req.usuario._id;
  const { categoria, nombre, descripcion, precioUni, disponible } = req.body;
  await UsuarioModel.findById(usuario, (err, usuarioBD) => {
    if (err)
      return res.status(500).json({
        ok: false,
        error: err,
      });
    if (!usuarioBD)
      return res.status(400).json({
        ok: false,
        error: err,
      });
  });
  await CategoriaModel.findById(categoria, (err, categoriaBD) => {
    if (err)
      return res.status(500).json({
        ok: false,
        error: err,
      });
    if (!categoriaBD)
      return res.status(400).json({
        ok: false,
        error: err,
      });
  });
  //pasó las validaciones => creo el producto
  new ProductoModel({
    usuario: req.usuario._id,
    categoria,
    nombre,
    descripcion,
    precioUni,
    disponible,
  }).save((err, productoNuevoBD) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err,
      });
    if (productoNuevoBD) {
      res.json({
        ok: true,
        ProductoNuevo: productoNuevoBD,
        message: "El producto ha sido creado con éxito",
      });
    } else {
      res.json({
        ok: false,
        error: "No se encontró la producto",
      });
    }
  });
};

const putProducto = async (req, res) => {
  const { categoria, nombre, descripcion, precioUni, disponible } = req.body;
  const productoActualizado = {
    categoria,
    nombre,
    descripcion,
    precioUni,
    disponible,
  };
  ProductoModel.findByIdAndUpdate(
    req.params.idProducto,
    productoActualizado,
    { new: true, runValidators: true, context: "query" },
    (err, productoActualizadoBD) => {
      if (err)
        return res.status(500).json({
          ok: false,
          error: err,
        });
      if (productoActualizadoBD) {
        res.json({
          ok: true,
          Producto_Actualizado: productoActualizadoBD,
        });
      } else {
        res.json({
          ok: false,
          error: "No se encontró la producto",
        });
      }
    }
  );
};

const deleteProducto = async (req, res) => {
  const disponible = false;
  ProductoModel.findByIdAndUpdate(
    req.params.idProducto,
    { disponible },
    { new: true },
    (err, productoEliminadoBD) => {
      if (err)
        return res.status(500).json({
          ok: false,
          error: err,
        });
      if (productoEliminadoBD) {
        res.json({
          ok: true,
          Producto_Eliminado: productoEliminadoBD,
          message: "El producto ha sido eliminado con éxito",
        });
      } else {
        res.json({
          ok: false,
          error: "No se encontró la producto",
        });
      }
    }
  );
};

module.exports = {
  getProductos,
  getUnProducto,
  buscarProductosPorFrase,
  postProducto,
  putProducto,
  deleteProducto,
};
