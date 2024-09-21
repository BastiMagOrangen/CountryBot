const { getPrettyFormat } = require("../helpers/messageHelper");

async function generateCountry() {
    const response = await fetch("http://localhost:3100/country/random");
    const f = await response.json();
    return getPrettyFormat(f);
}

module.exports = {
    generateCountry,
};