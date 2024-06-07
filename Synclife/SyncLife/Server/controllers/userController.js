const User = require("../models/Users");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const otpGenerator = require("otp-generator");

const secret = process.env.SECRET_KEY;
const userEmail = process.env.EMAIL;
const userPassword = process.env.PASSWORD;

const createToken = (_id) => {
  return jwt.sign({ _id }, secret, { expiresIn: "3d" });
};

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, birthDate, password } = req.body;
    console.log(firstName)
    if (!firstName || !lastName || !email || !birthDate || !password) {
      throw Error("All fields must be filled.");
    }

    if (!validator.isEmail(email)) {
      throw Error("Email is not valid");
    }

    if (!validator.isStrongPassword(password)) {
      throw Error("Password is not strong enough");
    }

    const currentDate = new Date();
    const userBirthDate = new Date(birthDate);
    const age = currentDate.getFullYear() - userBirthDate.getFullYear();
    if (age < 12) {
      throw Error("User must be at least 12 years old");
    }
    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ error: "This email is already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      birthDate,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw Error("All fields must be filled");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw Error("Email does not exist");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw Error("Incorrect Password");
    }

    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  const { email } = req.query;

  try {
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const forgotUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error("All fields must be filled");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email does not exist");
    }

    const generatedOTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    req.app.locals.generatedOTP = generatedOTP;

    let config = {
      service: "gmail",
      auth: {
        user: userEmail,
        pass: userPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    };

    let transporter = nodemailer.createTransport(config);

    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "SyncLife",
        link: "http://localhost:5173/",
      },
    });

    const userName = user.firstName;
    const response = {
      body: {
        name: userName,
        intro:
          "You have received this email because a password reset request for your account was received.This is your OTP(one time password).Do not share it with anyone else",
        outro: generatedOTP,
      },
    };

    const mail = mailGenerator.generate(response);

    const message = {
      from: userEmail,
      to: email,
      subject: "Reset Password",
      html: mail,
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Error sending email" });
      } else {
        res.status(201).json({
          email,
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const checkOtp = (req, res) => {
  try {
    const generatedOTP = req.app.locals.generatedOTP;
    const { otp } = req.body;

    if (otp === generatedOTP) {
      console.log("otp verified");
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const resetUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw Error("All fields must be filled");
    }

    if (!validator.isStrongPassword(password)) {
      throw Error("Password is not strong enough");
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      throw Error("Email does not exist");
    }

    const salt = await bcrypt.genSalt(10);
    ``;
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;

    
    const token = createToken(user._id);
    await user.save();
    res
      .status(200)
      .json({ email, token, message: "Password reset successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUser, signup, login, forgotUser, resetUser, checkOtp };
