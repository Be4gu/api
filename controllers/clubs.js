const clubsRouter = require('express').Router();
const Club = require('../models/Club');

clubsRouter.post('/', async (req, resp) => {
  const { body } = req;
  const { name, photo, player } = body;

  const newClub = new Club({
    name,
    photo,
    player,
    canonicalName: name.toUpperCase(),
  });
  const savedClub = await newClub.save();
  resp.status(201).json(savedClub);
});

clubsRouter.get('/', async (req, resp) => {
  const clubs = await Club.find({});
  resp.json(clubs);
});
clubsRouter.get('/:id', async (req, resp) => {
  const { id } = req.params;
  const clubs = await Club.findById(id).populate('player', {
    id: 1,
    nickName: 1,
    image: 1,
    name: 1,
    surname: 1,
    status: 1,
  });
  resp.json(clubs);
});

module.exports = clubsRouter;
