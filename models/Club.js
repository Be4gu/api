const { Schema, model } = require("mongoose");

const clubSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  photo: String,
  player: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

clubSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Club = model("Club", clubSchema);

module.exports = Club;
