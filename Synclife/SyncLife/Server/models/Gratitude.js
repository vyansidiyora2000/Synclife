const mongoose = require("mongoose");

const gratitudeSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  entry:{
    type:String,
  },
  image:{
    type:String,
  },
  user_id: {
    type:String,
    required:true,
},
});

const Gratitude = mongoose.model("Gratitude", gratitudeSchema);

module.exports = Gratitude;
