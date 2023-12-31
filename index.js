const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const cloudinary = require("cloudinary");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fileUpload = require("express-fileupload");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const path = require("path");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://nandish1729:Fx8fbRgsW6Nvl3GF@cluster0.idnfnxj.mongodb.net/spaceExploration?retryWrites=true&w=majority"
  )
  .then(console.log("connected to mongo db"))
  .catch((err) => console.log(err));

cloudinary.config({
  cloud_name: "dunyy1vx5",
  api_key: "156933712329698",
  api_secret: "7PcNV7Z6AD9fMgHq9ju_oHc3-X4",
});
app.use("/api/n1", userRoute);
app.use("/api/n1/satellite", async (req, res) => {
  try {
    const apiKey = "6EFUWD-P9TUBG-RJX7VG-55ZT";
    const latitude = 12.97623;
    const longitude = 77.60329;

    const apiUrl = `https://api.n2yo.com/rest/v1/satellite/positions/48859/${latitude}/${longitude}/0/1/?apiKey=${apiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to Fetch");
    }

    const data = await response.json();
    res.json({ positions: data.positions });
  } catch (err) {
    console.log("Error in fetching", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/api/n1/space-station", async (req, res) => {
  try {
    const apiKey = "6EFUWD-P9TUBG-RJX7VG-55ZT";
    const latitude = 12.97623;
    const longitude = 77.60329;

    const apiUrl = `https://api.n2yo.com/rest/v1/satellite/positions/25544/${latitude}/${longitude}/0/1/?apiKey=${apiKey}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to Fetch");
    }
    const data = await response.json();
    res.json({ positions: data.positions });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.use("/api/n1/ses-satellite", async (req, res) => {
  try {
    const apiKey = "6EFUWD-P9TUBG-RJX7VG-55ZT";
    const latitude = 12.97623;
    const longitude = 77.60329;

    const apiUrl = `https://api.n2yo.com/rest/v1/satellite/positions/36516/${latitude}/${longitude}/0/1/?apiKey=${apiKey}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to Fetch");
    }
    const data = await response.json();
    res.json({ positions: data.positions });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.use("/api/n1/agile-satellite", async (req, res) => {
  try {
    const apiKey = "6EFUWD-P9TUBG-RJX7VG-55ZT";
    const latitude = 12.97623;
    const longitude = 77.60329;

    const apiUrl = `https://api.n2yo.com/rest/v1/satellite/positions/36516/${latitude}/${longitude}/0/1/?apiKey=${apiKey}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to Fetch");
    }
    const data = await response.json();
    res.json({ positions: data.positions });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.use("/api/n1/space-launches", async (req, res) => {
  try {
    const apiUrl = "https://fdo.rocketlaunch.live/json/launches/next/5";
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    res.json({ result: data.result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/api/n1/space-events", async (req, res) => {
  try {
    const apiUrl = "https://calendarific.p.rapidapi.com/holidays";
    const apiKey = "fd8114ebf7msh5e4a2c5249cbb92p1b812cjsnd62dfc0e2278";

    const country = "US"; // Replace with the desired country code
    const year = 2023; // Replace with the desired year
    const month = 1; // Replace with the desired month (1 for January, 2 for February, and so on)

    const queryParams = `?country=${country}&year=${year}&month=${month}`;

    const url = `${apiUrl}${queryParams}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Basic bmFuZGlzaG06YXNrZXZlcnl0aGluRzA2MThAIw==",
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "calendarific.p.rapidapi.com",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error" });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nandish1729@gmail.com",
    pass: "sdfsadfvcX@#dfgtrfds",
  },
});

// Define email content
const getEmailOptions = (to, subject, text) => ({
  from: "nandish1729@gmail.com",
  to,
  subject,
  text,
});
app.use("/api/n1/schedule-email", async (req, res) => {
  try {
    const { email, launchName, launchTime } = req.body;

    // Set up launch time (replace this with your actual launch time)
    const launchDateTime = new Date(launchTime);

    // Schedule email reminder
    const job = scheduleEmail(launchDateTime, email, launchName);

    res.json({
      success: true,
      message: "Email Remainder successfully created",
    });
  } catch (err) {
    res.status(500).json({ success: false, err: "Cannot place the Email" });
  }
});

const scheduleEmail = (launchDateTime, email, launchName) => {
  const now = new Date();
  const timeUntilLaunch = launchDateTime - now;

  setTimeout(() => {
    const mailOptions = getEmailOptions(
      email,
      "Space Launch Reminder",
      `Reminder: The space launch "${launchName}" is scheduled!`
    );

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }, timeUntilLaunch);
};

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
app.listen(5000, () => console.log("server running on 5000 port"));
