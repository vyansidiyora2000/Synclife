const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  data: [
    {
      list: {
        type: String,
        required: true,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  user_id: {
    type: String,
    required: true,
  },
});

const Journal = mongoose.model("Journal", journalSchema);

module.exports = Journal;
