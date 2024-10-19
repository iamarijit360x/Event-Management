const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    bookingDates: [Date],
    status: { type: String,enum:['active','cancelled'],default: 'active' },
    totalPrice: { type: Number, required: true },
    adminId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},{timestamps:true});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
