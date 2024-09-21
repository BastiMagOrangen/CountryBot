const Server = require("../schemas/server");

async function getOrCreateServer(serverId) {
    let server = await Server.findOne({ id: serverId });
    if(!server) {
        server = new Server({ id: serverId});
        server.save();
    }
    return server; 
  }

  module.exports = {
    getOrCreateServer,
  };