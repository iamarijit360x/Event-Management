import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    bookingDates: [Date],
    totalPrice: { type: Number, required: true }
});
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
