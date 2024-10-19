const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bookingConfirmationEmail = require('../template/bookingConfirmation');
const eventCancellationEmail = require('../template/eventCancel');

dotenv.config();

class BookingService {
        normalizeDates(bookingDates){
        return bookingDates.map((date) => new Date(date).toISOString().split('T')[0]);
        }
        compareDates(dates1,dates2){
            return dates1.filter((date) => !dates2.includes(date));
        }

}

module.exports = new BookingService();
