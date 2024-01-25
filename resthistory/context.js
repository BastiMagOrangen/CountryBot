const sequelize = require("./database");
const Country = require("./model/Country");
const read = require("./readExports");

async function createCountries() {
  await Country.truncate();
  const countries = await read();
  console.log("Adding countries ...");
  countries.forEach((cn) => Country.create(cn));
}

module.exports = { createCountries };
