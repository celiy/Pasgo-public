const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const emailOptions = {
        from: `Pasgo suporte <${process.env.EMAIL_USER}>`,
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;