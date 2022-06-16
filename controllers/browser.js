const browserRouter = require('express').Router();
const User = require('../models/User');
const Club = require('../models/Club');
browserRouter.get('/filter/:name', async (req, resp) => {
  let { name } = req.params;
  name = JSON.parse(name);
  let users;
  users = await User.find({}).or(name);
  resp.json(users);
});
browserRouter.get('/search/:name', async (req, resp) => {
  let { name } = req.params;
  name = JSON.parse(name);
  const reg = RegExp('^' + name.toUpperCase());
  const users = await User.find({ canonicalName: reg });
  const club = await Club.find({ canonicalName: reg });

  const aux = [];
  users.forEach((ele) => {
    aux.push(ele);
  });

  club.forEach((ele) => {
    aux.push(ele);
  });

  resp.json(aux);
});

module.exports = browserRouter;
