const express = require("express");
const router = express.Router();
const {fetchMoodData , createMoodData, deleteMoodData} = require("../controllers/moodController");

const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.get("/" ,fetchMoodData);
router.post("/" , createMoodData);
router.delete("/" , deleteMoodData);


module.exports = router;