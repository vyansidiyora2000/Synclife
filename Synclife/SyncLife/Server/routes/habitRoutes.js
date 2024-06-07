const express = require("express");
const router = express.Router();
const {
  fetchHabit,
  createHabit,
  deleteHabit,
  updateHabit,
  completeHabit,
} = require("../controllers/habitController");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.get("/", fetchHabit);
router.post("/", createHabit);
router.delete("/:id", deleteHabit);
router.put("/:id", updateHabit);
router.post("/:id", completeHabit);

module.exports = router;
