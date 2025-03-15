import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import cors from 'cors';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Fix for `__dirname` in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Nodemailer configuration
const sender = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

// Function to read the HTML template and replace placeholders
const getEmailTemplate = (name, email, phoneNumber, comment) => {
    const filePath = path.join(__dirname, 'template.html');  // Fix applied
    let html = fs.readFileSync(filePath, 'utf8');
    return html.replace('{{name}}', name)
               .replace('{{email}}', email)
               .replace('{{phoneNumber}}', phoneNumber)
               .replace('{{comment}}', comment);
};

// Handle the POST request
app.post('/send-email', async (req, res) => {
    const { name, email, phoneNumber, comment } = req.body;

    if (!name || !email || !phoneNumber || !comment) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const emailTemplate = getEmailTemplate(name, email, phoneNumber, comment);

    const composemail = {
        from: email,
        to: 'skinsaviour24@gmail.com',
        subject: 'Customer Query',
        html: emailTemplate
    };

    try {
        await sender.sendMail(composemail);
        console.log("Mail sent successfully");
        res.status(200).json({ success: true, message: 'Mail sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
