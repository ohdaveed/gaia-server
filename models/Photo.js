const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  id: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "User",
  },
  url: String,
  plant_name: Array,
  latdec: Number,
  longdec: Number,
  name: String,
  tags: Array,
  user: String,
  public_id: String,
  coordinates: [Number],
  date: Date,
});

const Photo = mongoose.model("Photos", photoSchema);

module.exports = Photo;
