import * as Sequelize from "sequelize";
import sequelize from "../../orm";

export const Project = sequelize.define(
  "Project",
  {
    ID: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    Name: Sequelize.STRING,
    Description: Sequelize.STRING
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);