//si está en producción corre el puerto del entorno (ej. heroku), y cuando esté en
//desarrollo le asignará el 3000. Todo esto sin que el dev se entere
//===========PUERTO===============
process.env.PORT = process.env.PORT || 3000;

//===========ENTORNO===============
//HEROKU
//NODE_ENV es una variable de Heroku
process.env.NODE_ENV = process.env.NODE_ENV || "dev"; //si no existe => en desarrollo
//===========BASE DE DATOS===============

const MONGO_LOCAL = "mongodb://localhost:27017/cafe";
let URL_DB;
process.env.NODE_ENV === "dev"
  ? (URL_DB = process.env.MONGO_LOCAL)
  : (URL_DB = process.env.MONGO_URI);
  
process.env.URL_DB = URL_DB;
