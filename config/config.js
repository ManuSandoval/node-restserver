//si está en producción corre el puerto del entorno (ej. heroku), y cuando esté en
//desarrollo le asignará el 3000. Todo esto sin que el dev se entere
//===========PUERTO===============
process.env.PORT = process.env.PORT || 3000;

//===========ENTORNO===============
//HEROKU
//NODE_ENV es una variable de Heroku
process.env.NODE_ENV = process.env.NODE_ENV || "dev"; //si no existe => en desarrollo

//===========DURACION DEL TOKEN===============
//60"*60*24*30 = 30 días
process.env.EXPIRES_IN = 60 * 60 * 24 * 30;

//===========SEED (SECRET_KEY)===============
process.env.SECRET_KEY = process.env.SECRET_KEY || "este-es-el-seed";

//===========ID GOOGLE (CLIENT_ID)===============
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "710999825579-h7ftiuaofna7kvqvr4pn5akb1pc1lsas.apps.googleusercontent.com";
//===========BASE DE DATOS===============
const MONGO_LOCAL = "mongodb://localhost:27017/cafe";

let URL_DB;
process.env.NODE_ENV === "dev"
  ? (URL_DB = MONGO_LOCAL)
  : (URL_DB = process.env.MONGO_URI);

process.env.URL_DB = URL_DB;
