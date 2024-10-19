const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bookingConfirmationEmail = require('../template/bookingConfirmation');
const eventCancellationEmail = require('../template/eventCancel');

dotenv.config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendEmail(to, subject, htmlContent, cc = '') {
        const mailOptions = {
            from: process.env.EMAIL,
            to,
            cc,
            subject,
            html: htmlContent
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        } catch (error) {
            console.error('Error sending booking confirmation email:', error);
            throw new Error('Email sending failed');
        }
    }
    async sendEventCancellation(bookings) {
        for (const booking of bookings) {
            const htmlContent = eventCancellationEmail(booking);
            console.log(booking.userId.email,booking);
            
            await this.sendEmail(booking.userId.email, "Event Cancelled", htmlContent);
            await new Promise(resolve => setTimeout(resolve, 2000)); 
        }
    }

    async sendBookingConfirmation(bookingDetails) {
        const htmlContent = bookingConfirmationEmail(bookingDetails);
        this.sendEmail(bookingDetails.userId.email, 'Booking Confirmed', htmlContent);
    }
}

module.exports = new EmailService();
