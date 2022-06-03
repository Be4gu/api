const { Schema, model } = require("mongoose");

const languageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

languageSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Language = model("Language", languageSchema);

module.exports = Language;
