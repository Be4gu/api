const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");
const Club = require("../models/Club");
const Role = require("../models/Role");
const { response } = require("express");

usersRouter.post("/", async (req, resp, next) => {
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

usersRouter.get("/:id", async (req, resp) => {
  const { id } = req.params;
  const users = await User.findById(id)
    .populate("clubs.idClub", {
      name: 1,
      photo: 1,
      player: 1,
    })
    .populate("role")
    .populate("language");
  resp.json(users);
});

usersRouter.get("/", async (req, resp) => {
  const users = await User.find({})
    .populate("clubs.idClub", {
      name: 1,
      photo: 1,
    })
    .populate("role", {
      name: 1,
    });
  resp.json(users);
});

usersRouter.put("/:id", async (req, resp, next) => {
  const { id } = req.params;
  const { name, surname, nickName, contactEmail, list_roles } = req.body;
  let roles_id = [];
  for (let i = 0; i < list_roles.length; i++) {
    const role = await Role.find({ name: list_roles[i] });
    roles_id.push(role[0].id);
  }

  const user = await User.findById(id);
  user.name = name;
  user.surname = surname;
  user.nickName = nickName;
  user.contactEmail = contactEmail;
  user.role = roles_id;
  try {
    await user.save();
    resp.status(200).json(user);
  } catch (error) {
    next(error);
  }
});
usersRouter.put("/image/:id", async (req, resp, next) => {
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
