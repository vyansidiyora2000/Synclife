const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const habitRoutes = require("./routes/habitRoutes");
const journalRoutes = require("./routes/journalRoutes");
const authRoutes = require("./routes/authRoute");
const gratiRoutes = require("./routes/gratiRoute");
const moodRoute = require("./routes/moodRoute");
const app = express();
require('dotenv').config();

const PORT = 5007

app.use(cors());
app.use(express.json());

app.use('/' , express.static('assets'));

mongoose.connect("mongodb://127.0.0.1:27017/planner", { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/journal', journalRoutes);
app.use('/habits', habitRoutes);
app.use('/gratitude' , gratiRoutes);
app.use('/mood' , moodRoute);
app.use('/',authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});