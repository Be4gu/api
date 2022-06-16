const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  nickName: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    unique: true,
    required: true,
  },
  resCountry: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  natalCountry: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
  },
  canonicalName: String,
  status: Boolean,
  linkTwitch: String,
  linkVlr: String,
  linkTwitter: String,
  clubs: [
    {
      idClub: {
        type: Schema.Types.ObjectId,
        ref: 'Club',
      },
      entryDate: String,
      exitDate: String,
    },
  ],
  language: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Language',
      required: true,
    },
  ],
  image: String,
  role: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Role',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;

    delete returnedObject.passwordHash;
  },
});

const User = model('User', userSchema);

module.exports = User;
