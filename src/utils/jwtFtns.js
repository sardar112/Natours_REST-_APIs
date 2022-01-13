const jwt = require('jsonwebtoken');

const signToken = async (payload) => {
  await jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = { signToken };
