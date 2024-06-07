const express = require("express");
const router = express.Router();
const {
  fetchLists,
  addList,
  deleteList,
  updateList,
  completeList,
} = require("../controllers/journalController");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);


router.get("/", fetchLists);
router.post("/", addList);
router.delete("/:id", deleteList);
router.put("/:id", updateList);
router.post("/:id", completeList);

module.exports = router;
