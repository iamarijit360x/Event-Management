const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    bookingDates: [Date],
    totalPrice: { type: Number, required: true }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
