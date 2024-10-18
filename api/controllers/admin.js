const Service = require('../models/Service');
const User = require('../models/User');
const authService = require('../services/authService');

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
            contactDetails,
            createdBy:req.userId
        });
        
        res.status(201).json(service);
    } catch (error) {
        // Handle potential errors during service creation
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllBooking=async (req,res)=>{
    const createdBy = req.userId;
    const { page = 1, limit = 10, sortBy = 'bookingDate', sortOrder = 'asc' } = req.query; // Add query parameters

    try {
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1; // Set sorting order

        const bookings = await Booking.find({ createdBy })
            .populate('serviceId')
            .sort(sortOptions) // Apply sorting
            .skip((page - 1) * limit) // Calculate how many documents to skip
            .limit(Number(limit)); // Limit the number of results

        // Optionally, get the total count of bookings
        const totalBookings = await Booking.countDocuments({ createdBy });
        const totalPages = Math.ceil(totalBookings / limit);

        res.status(200).json({
            totalPages,
            currentPage: Number(page),
            bookings,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const obj=await authService.createUser(name, email, password,true)
        obj.message='Account Created Successfully'
        return res.status(201).json(obj)
    } catch (error) {
       return res.status(error.status).json(error)
    }
    
};