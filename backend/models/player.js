import pkg from "pg";
import dotenv from "dotenv";
import dbConfig from "../config/db.config.js";

dotenv.config();

const { Pool, Client } = pkg;

/*const client = new Client({
  user: dbConfig.USER,
  host: dbConfig.HOST,
  database: dbConfig.DB,
  password: dbConfig.PASSWORD,
  port: process.env.DB_PORT || 5432,
});*/

const client = new Pool({
  connectionString: `${process.env.POSTGRES_URL}?sslmode=require`,
});

client.connect((err) => {
  if (err) {
    console.error("Error de conexión", err.stack);
  } else {
    console.log("Conectado a la base de datos");
  }
});

export default client;
