import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import * as bcrypt from "bcrypt";
import cors from "cors";
import { Sequelize, DataTypes } from "sequelize";
import apiRouter from "./src/router";
import { indexFunction } from "./src/modules/index";
import { User } from "./src/modules/user/user.model";
const app = express();
const Config = require("config");
const port = Config.get("port");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(cors());
app.use("/", apiRouter);
app.use("/", indexFunction);
/* for log api request start */
import morganBody from "morgan-body";
morganBody(app);
/* for log api request end */

const sequelize = new Sequelize({
  dialect: "mysql",
  host: Config.get("database.mysql.host"),
  username: Config.get("database.mysql.username"),
  password: Config.get("database.mysql.password"),
  database: Config.get("database.mysql.dbName"),
});
let Password = "#Admin123";
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync(Password, salt);
Password = hash;
User.findOrCreate({
    where: { Username: 'admin' },
    defaults: {
      Username: 'admin',
      Password: Password
    },
  }).then(([user, created]) => {
  if (created) {
    console.log('User created:', user.get());
  } else {
    console.log('User already exists:', user.get());
  }
  app.listen(port, () => {
    console.log(`Connected successfully on port ${port}`);
  });
})
.catch((error) => {
  console.error('Unable to start the server:', error);
});