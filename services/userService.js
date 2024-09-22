const User = require("../schemas/user");

async function getUserCatches(userId) {
  let user = await User.findOne({ id: userId });
  return user ? user.catches : new Map();
}

async function getOrCreateUser(userId) {
  let user = await User.findOne({ id: userId });
  if (!user) {
    user = new User({ id: userId });
    user.save();
  }
  return user;
}

async function incrementCountryCatch(userId, countryId) {
  countryId = countryId.toString();
  try {
    let user = await User.findOne({ id: userId });
    if (user) {
      if (user.catches.has(countryId)) {
        // Increment the existing count
        user.catches.set(countryId, parseInt(user.catches.get(countryId), 10) + 1);
      } else {
        // Add a new entry for the countryId
        user.catches.set(countryId, 1);
      }
    } else {
      // Create a new user with the initial catch
      user = new User({
        id: userId,
        catches: new Map([[countryId, 1]]),
      });
    }
    await user.save();
    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update user catches");
  }
}

module.exports = { incrementCountryCatch, getUserCatches, getOrCreateUser };
