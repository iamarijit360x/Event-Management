import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, 
        match: /.+\@.+\..+/
    },
    phone: {
        type: String,
        required: true,
        match: /^\+?[1-9]\d{1,14}$/
    }
});

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    pricePerDay: { type: Number, required: true, min: 0 }, 
    description: { type: String },
    availableDates: [Date], // Consider how you will manage these dates
    location: { type: String, required: true },
    contactDetails: contactSchema
});

// Optionally add indexes
serviceSchema.index({ category: 1, location: 1 }); // Example indexing

const Service = mongoose.model('Service', serviceSchema);
export default Service;
