const Service = require('../models/Service');
const Booking = require('../models/Booking');



exports.getUserBookings = async (req, res) => {
    const userId = req.userId;

    try {
        const bookings = await Booking.find({ userId }).populate('serviceId');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.filterServices = async (req, res) => {
    const { minPrice, maxPrice, category, location, startDate, endDate, page = 1, limit = 10, sortBy = 'pricePerDay', sortOrder = 'asc' } = req.query;

    const query = {};

    // Price range filter
    if (minPrice || maxPrice) {
        query.pricePerDay = {};
        if (minPrice) {
            query.pricePerDay.$gte = Number(minPrice);
        }
        if (maxPrice) {
            query.pricePerDay.$lte = Number(maxPrice);
        }
    }

    // Category filter
    if (category) {
        query.category = { $regex: new RegExp(category, 'i') };
    }

    // Location filter
    if (location) {
        query.location = { $regex: new RegExp(location, 'i') };
    }

    // Date filtering logic
    const today = new Date();

    if (startDate && !endDate) {
        const start = new Date(startDate);
        if (start >= today) {
            query.availableDates = { $elemMatch: { $gte: start } }; // Show services from startDate if it's today or future
        } else {
            query.availableDates = { $elemMatch: { $gte: today } }; // If startDate is in the past, show services from today onwards
        }
    } else if (!startDate && endDate) {
        const end = new Date(endDate);
        query.availableDates = { $elemMatch: { $gte: today, $lte: end } }; // Show services from today to endDate
    } else if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= today) {
            query.availableDates = {
                $elemMatch: { $gte: start, $lte: end } // Show services between startDate and endDate if startDate is valid
            };
        } else {
            query.availableDates = { $elemMatch: { $gte: today, $lte: end } }; // If startDate is in the past, show services from today to endDate
        }
    }

    try {
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1; // Sorting order

        // Find and paginate the services
        const services = await Service.find(query)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        // Total count for pagination
        const totalServices = await Service.countDocuments(query);
        const totalPages = Math.ceil(totalServices / limit);

        res.status(200).json({
            totalPages,
            currentPage: Number(page),
            services,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};




