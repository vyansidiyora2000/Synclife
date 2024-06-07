const Gratitude = require("../models/Gratitude");

const fetchGratitude = async (req, res) => {
  try {
    const user_id = req.user._id;
    const gratitudes = await Gratitude.find({ user_id });
    res.json(gratitudes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createGratitude = async (req, res) => {
  try {
    const { date, entry } = req.body;
    const user_id = req.user._id;
    let gratitude = await Gratitude.findOne({ user_id, date });

    if (gratitude) {
  
      gratitude.entry = entry ? entry : gratitude.entry;
      gratitude.image = req.file ? req.file.filename : gratitude.image; 
    } else {
      gratitude = new Gratitude({
        date,
        entry,
        image: req.file ? req.file.filename : "blank.jpg",
        user_id,
      });
    }
    await gratitude.save();

    res.status(201).json(gratitude);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteGratitude = async (req, res) => {
  const { newDate } = req.body;
  const user_id = req.user._id;
  const date = newDate;

  try {
    const data = await Gratitude.findOneAndDelete({ user_id, date });
  
    if (!data) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { fetchGratitude, createGratitude , deleteGratitude};
