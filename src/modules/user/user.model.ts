import * as Sequelize from "sequelize";
import sequelize from "../../orm";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";
const RSA_PRIVATE_KEY = fs.readFileSync(
  path.join(__dirname, "./../../../keys/jwt_private.key")
);
const RSA_PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, "./../../../keys/jwt_public.key")
);

export const User = sequelize.define(
  "User",
  {
    ID: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    Username: Sequelize.STRING,
    Password: Sequelize.STRING
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

User.prototype.generateJWTToken = function () {
  const options: any = {
      algorithm: "RS256",
      expiresIn: 6000000,
      subject: this.Username,
    },
    payload = {
      ID: this.ID,
      Username: this.Username
    };
  return jwt.sign(payload, RSA_PRIVATE_KEY, options);
};

User.prototype.validatePassword = function (password) {
  return bcrypt.compare(password, this.Password);
};
export const decodeJWT = (header) => {
  const token = header.replace("Bearer ", "");
  return jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
    if (err) {
      console.log("error---", err);
      return false;
    }
    return decoded;
  });
};