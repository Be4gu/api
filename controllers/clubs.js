const clubsRouter = require("express").Router();
const Club = require("../models/Club");

clubsRouter.post("/", async (req, resp) => {
  const { body } = req;
  const { name, photo, player } = body;

  const newClub = new Club({
    name,
    photo,
  });
  const savedClub = await newClub.save();
  resp.status(201).json(savedClub);
});

clubsRouter.get("/", async (req, resp) => {
  const clubs = await Club.find({});
  resp.json(clubs);
});

clubsRouter.get("/:name", async (req, resp) => {
  const { name } = req.params;
  const clubs = await Club.find({ name });
  resp.json(clubs);
});

module.exports = clubsRouter;
