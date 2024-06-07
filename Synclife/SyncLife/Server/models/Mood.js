const mongoose = require("mongoose");

const moodSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  feeling: {
    value: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },

  activity: [
    {
      weather: [
        {
          value: {
            type: String,
          },
          image: {
            type: String,
          },
        },
      ],
      social: [
        {
          value: {
            type: String,
          },
          image: {
            type: String,
          },
        },
      ],
      location: [
        {
          value: {
            type: String,
          },
          image: {
            type: String,
          },
        },
      ],
      food: [
        {
          value: {
            type: String,
          },
          image: {
            type: String,
          },
        },
      ],
      health: [
        {
          value: {
            type: String,
          },
          image: {
            type: String,
          },
        },
      ],
      hobby: [
        {
          value: {
            type: String,
          },
          image: {
            type: String,
          },
        },
      ],
    },
  ],
  user_id: {
    type: String,
    required: true,
  },
});

const Mood = mongoose.model("Mood", moodSchema);

module.exports = Mood;
