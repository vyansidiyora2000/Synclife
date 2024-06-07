const Journal = require("../models/Journal");

const fetchLists = async (req, res) => {
  try {
    const user_id = req.user._id;
    const lists = await Journal.find({ user_id });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addList = async (req, res) => {
  const { date, list } = req.body;
  const user_id = req.user._id;
  try {
    const dateExist = await Journal.findOne({ user_id, date });

    if (dateExist) {
      dateExist.data.push({ list, isCompleted: false });
      await dateExist.save();
      res.json({ message: "List added" });
    } else {
      const newList = new Journal({
        date,
        data: [{ list, isCompleted: false }],
        user_id,
      });

      await newList.save();
      res.json({ message: "List added successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteList = async (req, res) => {
  const { id } = req.params;
  const { selecteddataId } = req.body;

  try {
    const data = await Journal.findOne({ _id: selecteddataId });
    if (!data) {
      return res.status(404).json({ message: "Journal not found" });
    }

    data.data = data.data.filter((item) => item._id.toString() !== id);

    if (data.data.length === 0) {
      await Journal.findByIdAndDelete(selecteddataId);
      return res.json({ message: "Document deleted successfully" });
    }

    await data.save();
    res.json({ message: "List deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateList = async (req, res) => {
  const { id } = req.params;
  const { updatedList, dataId, isCompleted } = req.body;

  try {
    const data = await Journal.findOne({ _id: dataId });
    
    if (!data) {
      return res.status(404).json({ message: "List not found" });
    }

    if (!data.data) {
      return res.status(404).json({ message: "Data not found in list" });
    }
    
    const list = data.data.find((item) => item._id.toString() === id);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    list.list = updatedList;
    list.isCompleted = isCompleted;

    data.markModified("data");
    await data.save();

    res.json({ message: "List updated successfully", updatedList });
  } catch (error) {
    console.error("Error in updation: ", error);
    res.status(500).json({ error: error.message });
  }
};

const completeList = async (req, res) => {
  const { id } = req.params;
  const { dataId } = req.body;

  try {
    const journal = await Journal.findOne({ _id: dataId });

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    const list = journal.data.find((item) => item._id.toString() === id);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    if (list.isCompleted) {
      return res.json({
        message: "Button state already clicked",
        isCompleted: list.isCompleted,
      });
    } else {
      list.isCompleted = true;

      journal.markModified("data");

      await journal.save();
    }

    res.json({
      message: "List completed successfully",
      isCompleted: list.isCompleted,
    });
  } catch (error) {
    console.error("Error completing list:", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = { fetchLists, addList, deleteList, updateList, completeList };
