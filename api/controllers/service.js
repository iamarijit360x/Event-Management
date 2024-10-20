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
    
    // Function to convert DD-MM-YYYY to valid Date object
    const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('-');
        const parsedDate = new Date(`${year}-${month}-${day}`);
        
        // Check if the parsed date is valid
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    };

    // Validate dates
    const start = startDate ? parseDate(startDate) : null;
    const end = endDate ? parseDate(endDate) : null;

    if ((startDate && !start) || (endDate && !end)) {
        return res.status(400).json({
            message: 'Invalid date format',
            error: 'Dates must be in DD-MM-YYYY format and must be valid dates.'
        });
    }

    // Validate minPrice and maxPrice
    if ((minPrice && isNaN(minPrice)) || (maxPrice && isNaN(maxPrice))) {
        return res.status(400).json({
            message: 'Invalid price format',
            error: 'minPrice and maxPrice must be valid numbers.'
        });
    }

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

    try {
        if (start && !end) {
            if (start >= today) {
                query.availableDates = { $elemMatch: { $gte: start } };
            } else {
                query.availableDates = { $elemMatch: { $gte: today } };
            }
        } else if (!start && end) {
            query.availableDates = { $elemMatch: { $gte: today, $lte: end } };
        } else if (start && end) {
            if (start >= today) {
                query.availableDates = {
                    $elemMatch: { $gte: start, $lte: end }
                };
            } else {
                query.availableDates = { $elemMatch: { $gte: today, $lte: end } };
            }
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

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





