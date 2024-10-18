const Service = require('../models/Service');
const Booking = require('../models/Booking');

// Get all services
// exports.getAllServices = async (req, res) => {
//     try {
//         const { page = 1, limit = 10, sortBy = 'pricePerDay', sortOrder = 'asc' } = req.query;

//         const sortOptions = {};
//         sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1; // 1 for ascending, -1 for descending

//         const services = await Service.find()
//             .sort(sortOptions)
//             .skip((page - 1) * limit) // Calculate how many documents to skip
//             .limit(Number(limit)); // Limit the number of results

//         // Optionally, you might want to get the total count of services
//         const totalServices = await Service.countDocuments();
//         const totalPages = Math.ceil(totalServices / limit);

//         res.status(200).json({
//             totalPages,
//             currentPage: Number(page),
//             services,
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


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
    const { minPrice, maxPrice, category, location, bookingDate, page = 1, limit = 10, sortBy = 'pricePerDay', sortOrder = 'asc' } = req.query;

    const query = {};
  
    if (minPrice || maxPrice) {
        query.pricePerDay = {};
        if (minPrice) {
            query.pricePerDay.$gte = Number(minPrice);
        }
        if (maxPrice) {
            query.pricePerDay.$lte = Number(maxPrice);
        }
    }
  
    if (category) {
        query.category = category;
    }
  
    if (location) {
        query.location = location;
    }
  
    if (bookingDate) {
        const date = new Date(bookingDate);
        query.availableDates = { $elemMatch: { $gte: date } }; // Check if the booking date is available
    }
  
    try {
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1; // Sorting order

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
            contactDetails,
            createdBy:req.userId
        });
        
        res.status(201).json(service);
    } catch (error) {
        // Handle potential errors during service creation
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
