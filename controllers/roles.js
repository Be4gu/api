const roleRouter = require("express").Router();
const Role = require("../models/Role");
const { response } = require("express");

roleRouter.post("/", async (req, resp, next) => {
  const { body } = req;
  const { name } = body;

  const newRole = new Role({
    name,
  });
  const savedRole = await newRole.save();
  resp.status(201).json(savedRole);
});

roleRouter.get("/", async (req, resp, next) => {
  const roles = await Role.find({});
  resp.json(roles);
});

module.exports = roleRouter;
