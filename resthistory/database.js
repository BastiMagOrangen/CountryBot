const { Sequelize } = require("sequelize");
//const Country = require('./common/models/Country');

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./storage/data.sqlite",
});

module.exports = sequelize;