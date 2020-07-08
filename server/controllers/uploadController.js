const UserModel = require("../models/Usuario");
const fs = require("fs");
const path = require("path");
const { type } = require("os");

const validExtensions = ["jpg", "jpeg", "gif", "png"];
const validTypes = ["product", "user"];

const cutExtension = (imgName) => {
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

const deletePreviousImg = (imgName, imgType) => {
  //create path
  const path = path.resolve(__dirname, `../`)
};

const updateUserImg = async (idUser, fileName, res) => {
  UserModel.findById(idUser, (error, userDB) => {
    if (error)
      return res.status(500).json({
        ok: false,
        error,
      });
    if (!userDB)
      return res.status(400).json({
        ok: false,
        error: "The id doesn't belong to any existing user.",
      });
    //the user exist in the DB => erase the link to the previous img
    deletePreviousImg(userDB.img, (imgType = "user"));
    //in the userDB.img I put only the fileName because the full path may change in the
    //future, also the full path require more memory space
    userDB.img = fileName;
    userDB.save((error, userSavedDB) => {
      if (error)
        return res.status(500).json({
          ok: false,
          error,
        });
      if (!userSavedDB)
        return res.status(400).json({
          ok: false,
          error: "The user doesn't exist.",
        });

      res.json({
        ok: true,
        user: userSavedDB,
        img: fileName,
      });
    });
  });
};

const uploadImg = async (req, res) => {
  if (!req.files)
    return res
      .status(400)
      .json({ ok: false, message: "No image has been selected" });

  const img = req.files.img;

  const imgName = img.name;
  const imgExtension = cutExtension(imgName);
  if (!extensionIsValid(imgExtension))
    return res.status(400).json({
      ok: false,
      message:
        "Image extension is not valid. Allowed extension are: " +
        validTypes.join(", "),
    });
  const imgType = req.params.type;
  if (!typeIsValid(imgType))
    return res.status(400).json({
      ok: false,
      message:
        "Image Type is not valid. Allowed types are: " +
        validExtensions.join(", "),
    });

  //if the extension and type are valid => save
  const idUser = req.params.id;
  const fileName = `${idUser}-${new Date().getMilliseconds()}.${imgExtension}`;
  await img.mv(`uploads/${imgType}/${fileName}`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err,
      });
    //the img was successfully uploaded => userDB must be update
    updateUserImg(idUser, fileName, res);
  });
};

module.exports = { uploadImg };
