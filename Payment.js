const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load .env variables

const app = express();
app.use(cors()); // Enable CORS for the frontend

// API route to get the WhatsApp phone number
app.get("/api/whatsapp-phone", (req, res) => {
  const phoneNumber = process.env.WHATSAPP_PHONE;
  res.json({ phone: phoneNumber });
});



// Start the server
const PORT = 3002;
app.listen(PORT, () => {
    console.log('Payment is running on port 3002');
});