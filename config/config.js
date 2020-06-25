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
process.env.NODE_ENV === "dev"
  ? (process.env.URL_DB = MONGO_LOCAL)
  : (process.env.URL_DB = MONGO_URI);
