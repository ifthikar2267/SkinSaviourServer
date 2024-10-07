const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

const cors = require('cors');
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Nodemailer configuration
var sender = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER, // Use environment variable for the email
        pass: process.env.EMAIL_PASS  // Use environment variable for the password
    }
});

// Function to read the HTML template and replace placeholders
const getEmailTemplate = (name, email, phoneNumber, comment) => {
    const filePath = path.join('template.html');
    let html = fs.readFileSync(filePath, 'utf8');
    html = html.replace('{{name}}', name)
               .replace('{{email}}', email)
               .replace('{{phoneNumber}}', phoneNumber)
               .replace('{{comment}}', comment);
    return html;
};

// Handle the POST request
app.post('/send-email', (req, res) => {
    const { name, email, phoneNumber, comment } = req.body;

    if (!name || !email || !phoneNumber || !comment) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Get the HTML template with filled placeholders
    const emailTemplate = getEmailTemplate(name, email, phoneNumber, comment);

    var composemail = {
        from: email,
        to: 'skinsaviour24@gmail.com',
        subject: 'Customer Query',
        html: emailTemplate // Send the email using the template
    };

    sender.sendMail(composemail, function(error, info){
        if(error){
            console.log(error);
            return res.status(500).json({ success: false, message: 'Failed to send email' });
        } else {
            console.log("Mail sent successfully: " + info.response);
            return res.status(200).json({ success: true, message: 'Mail sent successfully' });
        }
    });
});

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
