const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/send-location', async (req, res) => {
  const { name, lat, lon } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: 'Earora <' + process.env.GMAIL_USER + '>',
    to: 'sakshamchaudhary2020@gmail.com',
    subject: 'New Visitor on Earora',
    text: `Name: ${name}\nLatitude: ${lat}\nLongitude: ${lon}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Location sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending email' });
  }
});
app.get("/", (req, res) => {
  res.send("Earora backend is running");
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
