const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/User');
const Club = require('../models/Club');
const jwt = require('jsonwebtoken');

usersRouter.post('/', async (req, resp, next) => {
  const { body } = req;
  const { email, password, name, nickName, clubs, language, role, surname, image } = body;
  const { idClub } = clubs[0];
  const club = await Club.findById(idClub);
  console.log(clubs);

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    email,
    passwordHash,
    name,
    nickName,
    clubs,
    language,
    role,
    surname,
    image,
  });
  try {
    const savedUser = await newUser.save();

    club.player = club.player.concat(savedUser._id);
    await club.save();
    resp.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.get('/:id', async (req, resp) => {
  const { id } = req.params;
  const users = await User.findById(id)
    .populate('clubs.idClub', {
      name: 1,
      photo: 1,
      player: 1,
    })
    .populate('role')
    .populate('language')
    .populate('natalCountry', {
      alpha2: 0,
    })
    .populate('resCountry', {
      alpha2: 0,
    });
  resp.json(users);
});

usersRouter.get('/', async (req, resp) => {
  const users = await User.find({})
    .populate('clubs.idClub', {
      name: 1,
      photo: 1,
    })
    .populate('role', {
      name: 1,
    });
  resp.json(users);
});

usersRouter.put('/prueba/:id', async (req, resp, next) => {
  const { id } = req.params;

  const { name } = req.body;

  const authorization = req.get('authorization');
  console.log(authorization);
  let token = null;
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7);
  }
  let decodedToken = {};
  try {
    decodedToken = jwt.verify(token, process.env.SALT);
  } catch {}
  if (!token || !decodedToken.id) {
    return resp.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(id);
  user.name = name;

  try {
    await user.save();
    resp.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.put('/:id', async (req, resp, next) => {
  const { id } = req.params;
  const { name, surname, nickName, contactEmail, natalCountry, residentCountry, linkTwitch, linkTwitter, linkVlr, list_roles, list_langues, list_clubs } = req.body;
  let roles_id = [];
  let langues_id = [];
  let clubs_id = [];
  list_langues.forEach((ele) => {
    langues_id.push(ele.id);
  });
  list_roles.forEach((ele) => {
    roles_id.push(ele.id);
  });

  const authorization = req.get('authorization');
  let token = null;
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7);
  }
  let decodedToken = {};
  decodedToken = jwt.verify(token, process.env.SALT);
  if (!token || !decodedToken.id) {
    return resp.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(id);
  user.name = name;
  user.surname = surname;
  user.nickName = nickName;
  user.contactEmail = contactEmail;
  user.natalCountry = natalCountry;
  user.resCountry = residentCountry;
  user.linkTwitch = linkTwitch;
  user.linkTwitter = linkTwitter;
  user.linkVlr = linkVlr;
  user.role = roles_id;
  user.clubs = list_clubs;
  user.language = langues_id;
  try {
    await user.save();
    resp.status(200).json(user);
  } catch (error) {
    next(error);
  }
});
usersRouter.put('/image/:id', async (req, resp, next) => {
  const { id } = req.params;
  const { image } = req.body;
  const user = await User.findById(id);
  user.image = image;
  try {
    await User.findByIdAndUpdate(id, user, { new: true });
    resp.status(200).json(user.image);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
