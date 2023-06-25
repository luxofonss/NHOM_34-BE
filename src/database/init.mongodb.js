"user strict";

const mongoose = require("mongoose");
const {
  db: { host, port, name, username, password },
} = require("../config/config.mongodb");
const { countConnect } = require("../helpers/check_connect");
// const connectString = `mongodb://${host}:${port}/${name}`;
const connectString = `mongodb+srv://${username}:${password}@sopy.csmisue.mongodb.net/?retryWrites=true&w=majority`;
class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    mongoose.set("debug", { color: true });
    const dbName = process.env.PROD_DB_NAME;
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
        dbName,
      })
      .then((_) => {
        console.log("Connect database successfully!");
        // count number of connections ->
        // countConnect();
      })
      .catch((err) => console.log("Error connecting: ", err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
