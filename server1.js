const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 3001;

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: 'bakchodikarni@gmail.com', // Replace with your Gmail email address
        pass: 'jxzt rfhm vzbv nxse', // Replace with your Gmail App Password
    },
});

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Helper function to stringify objects
function stringifyObject(obj) {
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return obj.map(item => stringifyObject(item)).join(', ');
        } else if (obj !== null) {
            return JSON.stringify(obj, null, 2); // 2 is the number of spaces for indentation
        }
    }
    return obj;
}

// Endpoint for form submission
app.post('/submit', async (req, res) => {
    console.log('Received form data:', req.body);

    try {
        // Extract form data from the request
        const { name, mobile, recipientEmail, eventDate, makeupType, numberOfMakeups, readyTime, eventLocation } = req.body;

        // Your existing code for saving data to the database

        // Sending confirmation email to the user
        const userMailOptions = {
            from: 'bakchodikarni@gmail.com',
            to: recipientEmail,
            subject: 'Confirmation Email',
            text: 'Thank you for submitting the form. We will get back to you soon.',
        };

        // Sending confirmation email to admin
        const adminMailOptions = {
            from: 'bakchodikarni@gmail.com',
            to: 'ishitagulati15@gmail.com',
            subject: 'New Form Submission',
            text: `New form submission:\n` +
                `Name: ${stringifyObject(name)}\n` +
                `Mobile: ${stringifyObject(mobile)}\n` +
                `Email: ${recipientEmail}\n` +
                `Event Date: ${stringifyObject(eventDate)}\n` +
                `Makeup Type: ${stringifyObject(makeupType)}\n` +
                `Number of Makeups: ${stringifyObject(numberOfMakeups)}\n` +
                `Ready Time: ${stringifyObject(readyTime)}\n` +
                `Location: ${stringifyObject(eventLocation)}`,
        };

        // Send confirmation emails
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);

        res.status(200).send('Form submitted successfully');
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

