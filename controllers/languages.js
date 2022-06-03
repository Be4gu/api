const languageRouter = require("express").Router();
const Language = require("../models/Language");
const { response } = require("express");

languageRouter.post("/", async (req, resp, next) => {
  const { body } = req;
  const { name } = body;

  const newLanguage = new Language({
    name,
  });
  const savedLanguage = await newLanguage.save();
  resp.status(201).json(savedLanguage);
});

languageRouter.get("/", async (req, resp, next) => {
  const languages = await Language.find({});
  resp.json(languages);
});

languageRouter.get("/:name", async (req, resp) => {
  const { name } = req.params;
  const clubs = await Language.find({ name });
  resp.json(clubs);
});

module.exports = languageRouter;
