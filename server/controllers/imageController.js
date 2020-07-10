const fs = require("fs");
const path = require("path");
const UserModel = require("../models/Usuario");
const ProductModel = require("../models/Producto");

const validExtensions = ["jpg", "jpeg", "gif", "png"];
const validTypes = ["product", "user"];

const getExtension = (imgName) => {
  const cutName = imgName.split(".");
  const imgExtension = cutName[cutName.length - 1];
  return imgExtension;
};

const extensionIsValid = (imgExtension) => {
  //si no matchea con ninguno de las extensiones validas => retorno false
  return validExtensions.indexOf(imgExtension) < 0 ? false : true;
};

const typeIsValid = (imgType) => {
  return validTypes.indexOf(imgType) < 0 ? false : true;
};

const validateRequest = (imgExtension, imgType) => {
  if (!extensionIsValid(imgExtension))
    return res.status(400).json({
      ok: false,
      message:
        "Image extension is not valid. Allowed extension are: " +
        validTypes.join(", "),
    });
  //validate de type
  if (!typeIsValid(imgType))
    return res.status(400).json({
      ok: false,
      message:
        "Image Type is not valid. Allowed types are: " +
        validExtensions.join(", "),
    });
  return true;
};

const deletePreviousImg = (imgName, imgType) => {
  //create path
  const pathImg = path.resolve(
    __dirname,
    `../../uploads/${imgType}/${imgName}`
  );
  //if the image path exists => delete
  fs.existsSync(pathImg) && fs.unlinkSync(pathImg);
};

const updateImg = async (imgType, id, fileName, res) => {
  let Model;
  switch (imgType) {
    case "user":
      Model = UserModel;
      break;
    case "product":
      Model = ProductModel;
      break;
    default:
      return res.status(400).json({
        ok: false,
        error: "The image type doesn't exist",
      });
  }
  const recordOutdateDB = await Model.findById(id, (error, recordDB) => {
    if (error) return res.status(500).json({ ok: false, error });
    if (!recordDB)
      return res.status(400).json({
        ok: false,
        error: `The id doesn't belong to any existing ${imgType}.`,
      });
    //in the userDB.img I put only the fileName because the full path may change in the
    //future, also the full path require more memory space
    recordDB.img = fileName;
    recordDB.save((error, recordSavedDB) => {
      if (error)
        return res.status(500).json({
          ok: false,
          error,
        });
      if (!recordSavedDB)
        return res.status(400).json({
          ok: false,
          error: `The ${imgType} doesn't exist.`,
        });
    });
  });
  const previousImg = recordOutdateDB.img;
  return previousImg;
};

const generateFileName = (id, imgExtension) => {
  return `${id}-${new Date().getMilliseconds()}.${imgExtension}`;
};

const moveImg = async (res, img, imgType, fileName) => {
  await img.mv(`uploads/${imgType}/${fileName}`, (err) => {
    if (err) return res.status(500).json({ ok: false, err });
    else res.json({ ok: true, message: "Image successfully upload" });
  });
};

const uploadImg = async (req, res) => {
  if (!req.files)
    return res
      .status(400)
      .json({ ok: false, message: "No image has been selected" });

  const img = req.files.img;
  const { imgType, id } = req.params;
  const imgName = img.name;
  const imgExtension = getExtension(imgName);
  validateRequest(imgExtension, imgType);

  //if the extension and type are valid => update user
  const fileName = generateFileName(id, imgExtension);

  //updateImg()
  const previousImg = await updateImg(imgType, id, fileName, res);
  previousImg && deletePreviousImg(previousImg, imgType);

  //move img
  await moveImg(res, img, imgType, fileName);
};

const getImgPath = (imgType, fileName) => {
  let imgPath = path.resolve(__dirname, `../../uploads/${imgType}/${fileName}`);
  return fs.existsSync(imgPath)
    ? imgPath
    : (imgPath = path.resolve(__dirname, `../assets/noimage-found.png`));
};

const getImg = async (req, res) => {
  const { imgType, fileName } = req.params;

  const imgPath = getImgPath(imgType, fileName);
  res.sendFile(imgPath);
};

module.exports = { uploadImg, getImg };
