const { Schema, model } = require("mongoose");

const countrySchema = new Schema({
  alpha2: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  flag: {
    type: String,
    required: true,
  },
});
countrySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Country = model("Country", countrySchema);

module.exports = Country;
