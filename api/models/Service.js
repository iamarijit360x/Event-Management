const mongoose = require('mongoose');

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
    availableDates: [Date],
    location: { type: String, required: true },
    contactDetails: contactSchema,
    createdBy: { type: mongoose.Schema.Types.ObjectId,ref:'User',required: true }
});

// Optionally add indexes
serviceSchema.index({ category: 1, location: 1 });

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
