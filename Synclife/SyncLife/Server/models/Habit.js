const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    data:[{
        date:{
            type:Date,
            required:true,
        },
        isCompleted:{
            type:Boolean,
            default:false,
        },
    }],
    user_id: {
        type:String,
        required:true,
    },
});

const Habit= mongoose.model("Habit" , habitSchema);

module.exports = Habit;