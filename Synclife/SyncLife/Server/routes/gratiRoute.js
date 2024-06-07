const express = require("express");
const router = express.Router();
const multer = require("multer");
const path= require("path");
const { fetchGratitude, createGratitude ,deleteGratitude} = require("../controllers/gratiController");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"assets/images");
    },
    filename:(req,file,cb) =>{
        cb(null, file.fieldname + "_" + Date.now()+ path.extname(file.originalname));
    }
});

const upload = multer({
    storage:storage
});

router.get("/" ,fetchGratitude);
router.post("/" ,upload.single("file") , createGratitude);
router.delete("/" , deleteGratitude);


module.exports = router;