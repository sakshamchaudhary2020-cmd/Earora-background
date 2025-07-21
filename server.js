const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Render health check route
app.get("/", (req, res) => {
  res.send("Earora backend is running");
});

app.post("/api/send-location", async (req, res) => {
  const { latitude, longitude, name } = req.body;

  if (!latitude || !longitude || !name) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const emailBody = `
    <h3>New Visitor Details</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Location:</strong></p>
    <ul>
      <li>Latitude: ${latitude}</li>
      <li>Longitude: ${longitude}</li>
      <li><a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">View on Google Maps</a></li>
    </ul>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Earora Alerts" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: "New Visitor Location + Name",
    html: emailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Location sent successfully" });
  } catch (err) {
    console.error("Email send failed:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
