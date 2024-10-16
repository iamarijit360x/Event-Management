import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    description: { type: String },
    availabilityDates: [Date],
    contactDetails: { type: String, required: true }
});
const Service = mongoose.model('Service', serviceSchema);
export default Service;
