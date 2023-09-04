import { Sequelize } from 'sequelize';
const Config = require('config');
const sequelize = new Sequelize(
  Config.get('database.mysql.dbName'),
  Config.get('database.mysql.username'),
  Config.get('database.mysql.password'),
  {
    host: Config.get('database.mysql.host'),
    dialect: 'mysql',
    pool: {
      max: 1000,
      min: 1,
      acquire: 30000,
      idle: 10000
    },
  });

export default sequelize;
