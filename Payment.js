const express = require("express");
const cors = require("cors");
require("dotenv").config(); 

const app = express();
app.use(cors({
  origin: ["https://skinsaviour-store.web.app"],
}));

// API route to get the WhatsApp phone number
app.get("/api/whatsapp-phone", (req, res) => {
  console.log('request arrived')
  // const phoneNumber = process.env.WHATSAPP_PHONE;
  // console.log(phoneNumber)
  // res.json({ phone: phoneNumber });
});



const PORT = 3002;
app.listen(PORT, () => {
    console.log('Payment is running on port 3002');
});