const express = require("express");
const app = express();
const sequelize = require("./database");

const { createCountries } = require("./context");
const Country = require("./model/Country");

const arg1 = process.argv[2];
if (!arg1)
  sequelize
    .sync({
      force: true,
    })
    .then(() => {
      console.log("Database ready!");
      //NOTE - Only enable when regenerating
      createCountries();
    });
else if (arg1 === "nogenerate") {
  sequelize
    .sync({
      //force: true
    })
    .then(() => {
      console.log("(Starting without generating)");
      console.log("Database ready!");
      //NOTE - Only enable when regenerating createCountries();
    });
}

const PORT = process.env.PORT || 3100;

//STUB - Routes

app.get("/country/all", async (req, res) => {
  res.send(await Country.findAll({}));
});

app.get("/country/name/:name", async (req, res) => {
  res.send(
    await Country.findOne({
      where: {
        name: req.params.name,
      },
    })
  );
});

app.get("/country/id/:id", async (req, res) => {
  res.send(
    await Country.findOne({
      where: {
        id: req.params.id,
      },
    })
  );
});

app.get("/country/random", async (req, res, next) => {
  let rarity = Math.floor(Math.random() * 99) + 1;

  if (rarity <= 40) rarity = 1;
  else if (rarity <= 70) rarity = 2;
  else if (rarity <= 85) rarity = 3;
  else if (rarity <= 93) rarity = 4;
  else if (rarity <= 98) rarity = 5;
  else rarity = 6;

  const countries = await Country.findAll({ where: { rarity: rarity } });
  let country = countries[Math.floor(Math.random() * countries.length)];

  if (country) res.send(country);
  else res.status(400).json({ error: "No Country found" });
});

app.listen(PORT, () => {
  console.log("App listening on port " + PORT);
});
