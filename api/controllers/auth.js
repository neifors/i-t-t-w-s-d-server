require("dotenv").config();

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

async function register(req, res) {
  try {
    let newUsername = req.body.username;
    let response = await User.findIfUsernameExists(newUsername);
    if (!!response) {
      throw new Error("Username not available");
    }
    const salt = await bcryptjs.genSalt();
    const hashed = await bcryptjs.hash(req.body.password, salt);
    const result = await User.create({ ...req.body, password_digest: hashed });
    res.status(201).json({ msg: "user created!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function login(req, res) {
  try {
    if (!req.body.username) {
      throw new Error("No username inserted");
    }
    if (!req.body.password) {
      throw new Error("No password inserted");
    }

    // -----
    const user = await User.findByUsername(req.body.username);
    const authed = await bcryptjs.compare(
      req.body.password,
      user.passwordDigest
    );
    if (!!authed) {
      const payload = { username: user.username };
      let token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: 1000,
      });
      res.status(200).json({
        success: true,
        token: "Bearer " + token,
      });
      // ------
      // const user = await User.findByUsername(req.body.username);
      // const authed = bcryptjs.compare(req.body.password, user.passwordDigest);
      // if (!!authed) {
      //   const payload = { username: user.username };
      //   const sendToken = (err, token) => {
      //     if (err) {
      //       throw new Error("Error in token generation");
      //     }
      //     res.status(200).json({
      //       success: true,
      //       token: "Bearer " + token,
      //     });
      //   };
      //   jwt.sign(payload, process.env.SECRET, { expiresIn: 1000 }, sendToken);
    } else {
      throw new Error("User could not be authenticated");
    }
  } catch (err) {
    res.status(401).send(err.message);
  }
}

module.exports = { register, login };
