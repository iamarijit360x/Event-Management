import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bookingConfirmationEmail from '../template/bookingConfirmation.mjs'
dotenv.config();
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: process.env.EMAIL,
                pass:  process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendEmail(to,subject,htmlContent,cc='') {
        const mailOptions = {
            from:process.env.EMAIL,
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
    async sendBookingConfirmation(bookingDetails) {
        const htmlContent=bookingConfirmationEmail(bookingDetails);
        this.sendEmail(bookingDetails.userId.email,'Booking Confirmed',htmlContent);
    }
}

export default new EmailService();
