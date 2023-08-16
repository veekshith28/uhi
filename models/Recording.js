const mongoose = require("mongoose");

const recordingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    audioData: {
      type: Buffer,
      required: true,
    },
    // Add more fields as needed
  },
  {
    timestamps: true,
  }
);

const Recording = mongoose.model("Recording", recordingSchema);

module.exports = Recording;
