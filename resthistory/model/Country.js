const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class Country extends Model {}

Country.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    birthYear: {
      type: DataTypes.INTEGER,
    },
    deathYear: {
      type: DataTypes.INTEGER,
    },
    independent: {
      type: DataTypes.BOOLEAN,
    },
    historical: {
      type: DataTypes.BOOLEAN,
    },
    alternatives: {
      type: DataTypes.STRING,
    },
    rarity: {
      type: DataTypes.INTEGER,
    },
    flagURL: {
      type: DataTypes.STRING,
    },
    mapURL: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "country",
    timestamps: false,
  }
);

module.exports = Country;
