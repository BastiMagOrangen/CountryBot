const { parse } = require("csv-parse");
const fs = require("fs");
const util = require("util");

async function read() {
  const exported = [];
  const exportPromise = new Promise((resolve, reject) => {
    fs.createReadStream("./storage/countries.csv", { encoding: "utf-8" })
      .pipe(parse({ delimiter: ";", from_line: 2, encoding: "utf-8" }))
      .on("data", function (row) {
        if (!row[0].includes("/") && !row[0].includes("1")) {
          let obj = {
            name: row[0],
            birthYear: row[1],
            deathYear: row[2],
            //alternatives: row[3].split(",") || [row[3]],
            alternatives: row[3],
            independent: row[4],
            historical: row[5],
            rarity: row[6],
            flagURL: row[7],
            mapURL: row[8],
          };
          exported.push(obj);
        }
      })
      .on("error", function (error) {
        console.log(error.message);
        reject();
      })
      .on("end", function () {
        console.log("File read successful");
        /*
          fs.writeFile(
          "./storage/exported.json",
          JSON.stringify(exported),
          {
            encoding: "utf-8",
          },
          () => {
            console.log("File write successful");
            
          }
        );
        */
        resolve(exported);
      });
    console.log("CSV Read Done");
  });
  return exportPromise;
}

module.exports = read;
