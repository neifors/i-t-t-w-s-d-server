require("dotenv").config();

const bcryptjs = require("bcryptjs");

const User = require("../models/User");

async function index(req, res) {
  //returns an array
  try {
    const users = await User.all;
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json(err.message);
  }
}

async function findByUsername(req, res) {
  //returns an object
  try {
    const user = await User.findByUsername(req.params.username);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json(err.message);
  }
}

async function updatePassword(req, res) {
  try {
    const user = await User.findByUsername(req.params.username);
    const authed = await bcryptjs.compare(
      req.body.password,
      user.passwordDigest
    );
    if (!authed) {
      console.log(1);
      throw new Error("Invalid password");
    }
    const salt = await bcryptjs.genSalt();
    const hashed = await bcryptjs.hash(req.body.newPassword, salt);
    const response = await User.changePassword(req.params.username, hashed);
    res.status(200).json({ msg: response });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
}

module.exports = { index, findByUsername, updatePassword };
