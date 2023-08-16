const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Recording = require("../models/recordingroute"); // Import the Recording model
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/save-audio-recording", authMiddleware, upload.single("audioData"), async (req, res) => {
  try {
    const { userId } = req.body;

    const newRecording = new Recording({
      userId,
      audioData: req.file.buffer,
    });

    await newRecording.save();

    res.json({ success: true, message: "Recording saved successfully." });
  } catch (error) {
    console.error("Error saving recording:", error);
    res.status(500).json({ success: false, message: "Failed to save recording." });
  }
});
  module.exports = router;
  