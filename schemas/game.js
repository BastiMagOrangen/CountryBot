const { Schema, model } = require("mongoose");
const Server = require("./server");
const User = require("./user");
const GameUser = require("./gameUser");
const { v4: uuidv4 } = require("uuid");

const GameSchema = new Schema({
  uuid: {
    type: String,
    default: uuidv4,
    uniqe: true,
  },
  server: {
    type: Schema.Types.ObjectId,
    ref: Server,
    required: true,
  },
  channel: {
    type: Number,
    required: true,
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  players: {
    type: Array,
    of: Schema.Types.ObjectId,
    ref: GameUser,
    required: true,
  },
  type: {
    type: String,
    enum: ["countries", "deadbydaylight"],
    required: true,
  },
  goal: {
    type: Number,
    default: 10,
  },
});

module.exports = model("Game", GameSchema);
