const Service = require('../models/Service');

// Create a service
exports.createService = async (req, res) => {
    const { title, category, pricePerDay, description, availabilityDates, location, contactDetails } = req.body;
    
    // Validate required fields
    if (!title || !category || !pricePerDay || !description || !availabilityDates || !location || !contactDetails) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate price
    if (pricePerDay <= 0) {
        return res.status(400).json({ message: 'Price per day must be greater than zero.' });
    }

    try {
        // Create the service
        const service = await Service.create({
            title,
            category,
            pricePerDay,
            description,
            availabilityDates,
            location,
            contactDetails
        });
        
        res.status(201).json(service);
    } catch (error) {
        // Handle potential errors during service creation
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
