const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middlewares/authMiddleware");
const bcrypt = require('bcrypt');
router.get("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.post(
  "/change-doctor-account-status",
  authMiddleware,
  async (req, res) => {
    try {
      const { doctorId, status } = req.body;
      const doctor = await Doctor.findByIdAndUpdate(doctorId, {
        status,
      });

      const user = await User.findOne({ _id: doctor.userId });
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "new-doctor-request-changed",
        message: `Your doctor account has been ${status}`,
        onClickPath: "/notifications",
      });
      user.isDoctor = status === "approved" ? true : false;
      await user.save();

      res.status(200).send({
        message: "Doctor status updated successfully",
        success: true,
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error applying doctor account",
        success: false,
        error,
      });
    }
  }
);
router.post("/remove-user-by-email", authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    // Find and remove the user by email
    const user = await User.findOneAndRemove({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ message: "User account removed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing the request." });
  }
});  
// Route to create a doctor accou

router.post("/add-doctor", authMiddleware, async (req, res) => {
  try {
    const { email, password, ...doctorData } = req.body;

    // Check if the user with the given email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user account with hashed password and isDoctor: true
    const newUser = new User({
      email,
      password: hashedPassword,
      isDoctor: false,
      isAdmin: false,
      ...doctorData,
    });
    await newUser.save();

    res.status(201).json({ message: "Doctor account created successfully" });
  } catch (error) {
    console.error("Error creating doctor account:", error);
    res.status(500).json({ message: "Error creating doctor account" });
  }
});

module.exports = router;