const countryRouter = require("express").Router();
const res = require("express/lib/response");
const Country = require("../models/Country");

countryRouter.post("/", async (req, resp, next) => {
  const { alpha2, name, flag } = req.body;

  const newCountry = new Country({
    alpha2,
    name,
    flag,
  });
  const savedCountry = await newCountry.save();
  resp.status(201).json(savedCountry);
});

countryRouter.get("/", async (req, resp) => {
  const contryes = await Country.find({});
  resp.json(contryes);
});
module.exports = countryRouter;
