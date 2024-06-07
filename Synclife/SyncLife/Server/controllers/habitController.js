const Habit = require("../models/Habit");

const moment = require("moment");

const fetchHabit = async (req, res) => {
    try {
      const user_id = req.user._id;
      const habits = await Habit.find({user_id});
      res.json(habits);
    } catch (error) {
      res.status(500).json("error:error.message");
    }
};

const createHabit = async (req,res) => {
    try {
        const { name, startDate, endDate } = req.body;
        const user_id = req.user._id;
        const habit = new Habit({
          name,
          startDate,
          endDate,
          data: generateDatasArray(startDate, endDate),
          user_id,
        });
        await habit.save();
    
        res.status(201).json(habit);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server Error" });
      }
};

const deleteHabit = async (req,res) => {
    try{
        await Habit.findByIdAndDelete(req.params.id);
        res.json({message:"Deleted successfully"});
      }catch(error){
        res.status(500).json({error:error.message});
      }
};

const updateHabit = async (req, res) => {
    try{
        const { id } = req.params;
        const { name , startDate , endDate } = req.body;
    
        const habit = await Habit.findByIdAndUpdate(
          id,
          {name , startDate , endDate},
          {new:true},
        );
    
        if(!habit)
        {
          return res.status(404).json({message: "Habit not found"});
        }
        habit.data = generateDatasArray(startDate, endDate);
    
        await habit.save();
    
        res.json(habit);
      }
      catch(error){
        res.status(500).json({message: "Habit not found"});
      }
};

const completeHabit = async (req,res) => {
    try {
        const { id } = req.params;
    
        const habit = await Habit.findById(id);
    
        if (!habit) {
          return res.status(404).json({ message: "Habit not found" });
        }
    
        const { date } = req.body;
        const habitDate = habit.data.find(
          (habitDate) => moment(habitDate.date).format() === moment(date).format()
        );
    
        if (habitDate) {
          habitDate.isCompleted = !habitDate.isCompleted;
          await habit.save();
          res.json(habit);
        } else {
          res.status(404).json({ message: "Date not found for the habit" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
};

function generateDatasArray(startDate, endDate) {
    const data = [];
  
    let currentDate = moment(startDate);
  while (currentDate.isSameOrBefore(endDate , 'day')) {
    
    data.push({  date: currentDate.format("YYYY-MM-DD"), isCompleted: false });
    currentDate.add(1, "day");
  }
  return data;
};

module.exports = { fetchHabit , createHabit , deleteHabit , updateHabit ,completeHabit};