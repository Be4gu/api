const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/User');
const Club = require('../models/Club');
const jwt = require('jsonwebtoken');

usersRouter.get('/pruebaaaa/:elem', async (req, resp) => {
  let { elem } = req.params;
  elem = JSON.parse(elem);
  const users = await User.find({}).or(elem);

  resp.json(users);
});
usersRouter.get('/pruebaaaa2/:elem', async (req, resp) => {
  let { elem } = req.params;
  elem = JSON.parse(elem);
  const reg = RegExp('^' + elem);
  const users = await User.find({ nickName: reg });
  const club = await Club.find({ name: reg });
  const reg2 = RegExp('^' + elem.toUpperCase());
  const club2 = await Club.find({ name: reg2 });
  const users2 = await User.find({ nickName: reg2 });
  const aux = [];
  users.forEach((ele) => {
    aux.push(ele);
  });
  users2.forEach((ele) => {
    aux.push(ele);
  });
  club.forEach((ele) => {
    aux.push(ele);
  });
  club2.forEach((ele) => {
    aux.push(ele);
  });
  resp.json(aux);
});
usersRouter.post('/', async (req, resp, next) => {
  const { email, name, surname, nickName, password, image, contactEmail, natalCountry, residentCountry, linkTwitch, linkTwitter, linkVlr, list_roles, list_langues, list_clubs } = req.body;
  let roles_id = [];
  let langues_id = [];
  list_langues.forEach((ele) => {
    langues_id.push(ele.id);
  });
  list_roles.forEach((ele) => {
    roles_id.push(ele.id);
  });

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      passwordHash,
      name,
      surname,
      nickName,
      contactEmail,
      natalCountry,
      resCountry: residentCountry,
      linkTwitch,
      linkTwitter,
      linkVlr,
      language: langues_id,
      role: roles_id,
      clubs: list_clubs,
      image,
    });
    await newUser.save();
    return resp.json({ succes: 'The user has been created successfully' });
  } catch (error) {
    console.log(error);
    aux = error.message.split(' { ');
    aux2 = aux[1].split(':');
    console.log(aux2[0]);
    if (aux2[0] === 'contactEmail') {
      return resp.json({ error: 'Contact email alredy exists' });
    } else if (aux2[0] === 'email') {
      return resp.json({ error: 'Email alredy exists' });
    }
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
usersRouter.put('/:id', async (req, resp, next) => {
  const { id } = req.params;
  const { name, surname, nickName, contactEmail, natalCountry, residentCountry, linkTwitch, linkTwitter, linkVlr, list_roles, list_langues, list_clubs } = req.body;
  let roles_id = [];
  let langues_id = [];
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
