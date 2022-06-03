const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");
const Club = require("../models/Club");
const Role = require("../models/Role");
const { response } = require("express");

usersRouter.post("/", async (req, resp, next) => {
  const { body } = req;
  const { email, password, name, nickName, clubs, language, role } = body;
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
  const { idClub, exitDate, entryDate } = req.body.clubs;
  console.log();
  const user = await User.findById(id);
  user.clubs = user.clubs.push({
    idClub,
    exitDate,
    entryDate,
  });
  try {
    await User.findByIdAndUpdate(id, user, { new: true });
    resp.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
