const { token, application_id, server, client_id } = require("./config.json")
const { REST, Routes } = require("discord.js");

const commands = [
    {
        name: "hallo",
        description: "Hallo"
    },
    {
        name: "guess",
        description: "Guess a random country"
    }
]
 
console.log(token);
const rest = new REST({version: "10"}).setToken(token);

(async () => {
    try {
        console.log("Register Commands");
        await rest.put(Routes.applicationCommands(client_id), {body: commands})
        console.log("Finished registring");
    } catch(error) {
        console.log(error);
    }
})();