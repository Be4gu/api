//conexion a mongodb

const mongoose = require("mongoose"); //importa el modulo de mongoose

const connectionString = process.env.MONGO_DB_URI;

mongoose
  .connect(connectionString) //Hace la conexion con la base de datos
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

// En caso de algun error que no sea controlado cierra la conexion
process.on("uncaughtException", (error) => {
  console.log(error);
  mongoose.disconnect();
});
