const nodemailer = require('nodemailer');
const config = require('../config.json');

module.exports = sendEmail;

async function sendEmail({ to, subject, text, html, from = config.emailFrom }) {
    const transporter = nodemailer.createTransport(config.smtpOptions);
    await transporter.sendMail({ from, to, subject, text, html });
}