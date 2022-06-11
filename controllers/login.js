const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/User');

loginRouter.post('/', async (req, resp) => {
  const { body } = req;
  const { email, password } = body;
  console.log(email + ' ' + password);
  const user = await User.findOne({ email });
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    resp.status(401).json({
      error: 'Invalid user or password',
    });
  }
  const userForToken = {
    email: user.email,
    id: user.id,
  };

  const token = jwt.sign(userForToken, process.env.SALT);

  resp.send({
    id: user.id,
    name: user.name,
    token,
  });
});

module.exports = loginRouter;
