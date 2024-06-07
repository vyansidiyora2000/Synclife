const express = require("express");
const {getUser , signup , login , forgotUser , resetUser , checkOtp} = require("../controllers/userController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user" , getUser);
router.post("/forgotPassword",forgotUser);
router.post("/forgotPassword/otp",checkOtp);
router.post("/resetPassword", resetUser);

module.exports = router;
