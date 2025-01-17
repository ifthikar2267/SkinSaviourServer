// const express = require("express");
// const cors = require("cors");
// require("dotenv").config(); 

// const app = express();
// app.use(cors({
//   origin: "https://skinsaviour-store.web.app",
// }));

// // API route to get the WhatsApp phone number
// app.get("/api/whatsapp-phone", (req, res) => {
//   console.log('request arrived')
//   const phoneNumber = process.env.WHATSAPP_PHONE;
//   console.log(phoneNumber)
//   res.json({ phone: phoneNumber });
// });



// const PORT = 3002;
// app.listen(PORT, () => {
//     console.log('Payment is running on port 3002');
// });

const express = require('express');
const cors = require('cors'); // Enable CORS for cross-origin requests
const app = express();
const PORT = 5000;

// Use CORS middleware
app.use(cors());

// Sample data
const products = [
  { id: 1, name: 'Product 1', price: 100 },
  { id: 2, name: 'Product 2', price: 200 },
  { id: 3, name: 'Product 3', price: 300 },
];

// GET route to fetch products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
