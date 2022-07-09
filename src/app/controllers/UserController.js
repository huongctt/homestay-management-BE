const express = require("express");
const User = require("../models/user.js");
const auth = require("../middleware/auth.js");
class UserController {
  async register(req, res) {
    const user = new User({
      ...req.body,
    });
    try {
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({
        user,
        token,
      });
    } catch (e) {
      res.status(400).send(e);
      console.log("Error: " + e);
    }
  }

  async login(req, res) {
    try {
      console.log(req.body);
      const user = await User.findByCredentials(
        req.body.username,
        req.body.password
      );
      const token = await user.generateAuthToken();
      res.status(200).send({
        user,
        token,
      });
    } catch (e) {
      res.status(400).send(e);
      console.log("Error: " + e);
    }
  }

  async getCurrentUser(req, res) {
    try {
      res.send(req.user);
    } catch (e) {
      res.status(400).send(e);
      console.log("Error: " + e);
    }
  }
  async logout(req, res) {
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token;
      });
      await req.user.save();
      res.send({
        message: "ok",
      });
    } catch (e) {
      res.status(500).send();
    }
  }
}

module.exports = new UserController();
