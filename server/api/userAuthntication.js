const express = require('express');
const router = express.Router();
const User = require("../model/userModel");
const sendToken = require("../utils/sendtoken");


// Register User

router.post("/register", async (req, res, next) => {
    try {

        const { userName, userEmail, userPassword } = req.body;
        // Validation

        if (!userName || !userEmail || !userPassword) {
            res.status(400).json({ success: false, message: "Please Provide all fields" })
            return
        }

        if (userPassword.length < 6) {
            res.status(400).json({ success: false, message: "Password must be up to 6 characters" })
            return
        }

        const userExists = await User.findOne({ userEmail });
        if (userExists) {
            res.status(400).json({ success: false, message: "Email been already used try with different email or login" })
            return
        }

        // Creting A user 
        const user = await User.create({
            userName,
            userEmail,
            userPassword,
        });

        sendToken(user, 201, res);
    } catch (error) {
        console.log("Error Occured while Creating user", error);
    }
});

// Login User

router.post("/login", async (req, res, next) => {

    try {
        const { userEmail, userPassword } = req.body;

        // checking if user has given password and email both

        if (!userEmail || !userPassword) {
            res.status(400).json({ success: false, message: "Please Enter Email & Password" })
            return
        }

        const user = await User.findOne({ userEmail }).select("+userPassword");

        if (!user) {
            res.status(401).json({ success: false, message: "Invalid email or password" })
            return
        }

        if (user.userPassword == userPassword) {
            sendToken(user, 200, res);
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" })
            return
        }

    } catch (error) {
        console.log(error)
    }
});

// Logout User

router.get("/logout",async (req, res, next) => {

    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  
  });

module.exports = router;