const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
app.use(express.json());
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorsRoute");
const path = require("path");
const multer = require("multer");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use("/api/user", userRoute); // Make sure your userRoute is correctly handling the audio upload
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);

// Handle audio file upload
app.post("/api/upload-audio", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No audio file uploaded." });
  }

  // You can access the audio file's buffer using req.file.buffer
  // Process the buffer or save it to the database

  return res.json({ success: true, message: "Audio file uploaded successfully." });
});

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
}

const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Node Express Server Started at ${port}!`));
