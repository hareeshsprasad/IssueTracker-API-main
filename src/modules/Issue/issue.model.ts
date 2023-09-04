import * as Sequelize from "sequelize";
import sequelize from "../../orm";

export const Issue = sequelize.define(
  "Issue",
  {
    ID: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    Tracker:Sequelize.ENUM('0', '1'), // 0 for feature 1 for bug //
    Description: Sequelize.STRING,
    ProjectID: Sequelize.INTEGER,
    Status: Sequelize.ENUM('0', '1'), // 1 for active and 0 for closed //
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);