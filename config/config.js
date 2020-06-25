//si está en producción corre el puerto del entorno (ej. heroku), y cuando esté en
//desarrollo le asignará el 3000. Todo esto sin que el dev se entere
//===========PUERTO===============
process.env.PORT = process.env.PORT || 3000;

//===========ENTORNO===============
//HEROKU
//NODE_ENV es una variable de Heroku
process.env.NODE_ENV = process.env.NODE_ENV || "dev"; //si no existe => en desarrollo
//===========BASE DE DATOS===============
const URL_REMOTA =
  "mongodb+srv://manucosa:EaXoXerucp6EYRHW@cluster0-tbyst.mongodb.net/cafe";
const URL_LOCAL = "mongodb://localhost:27017/cafe";
let urlDB;
process.env.NODE_ENV === "dev" ? (urlDB = URL_LOCAL) : (urlDB = URL_REMOTA);
process.env.URLDB = URL_REMOTA;
