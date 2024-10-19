const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const authService = require('../services/authService');
const emailService = require('../services/emailService');

// Create a service
exports.createService = async (req, res) => {
    const { title, category, pricePerDay, description, availableDates, location, contactDetails } = req.body;
    console.log(req.body)
    try {
        // Create the service
        const service = await Service.create({
            title,
            category,
            pricePerDay,
            description,
            availableDates,
            location,
            contactDetails,
            createdBy: req.userId
        });

        res.status(201).json(service);
    } catch (error) {
        // Handle potential errors during service creation
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.editService = async (req, res) => {
    const { serviceId } = req.params; // Service ID from the request params
    const updateData = req.body; // Data to update, could be one or more fields
    try {
        // Find and update the service with only the fields that are provided in the request body
        const service = await Service.findOneAndUpdate({ _id: serviceId, createdBy: req.userId }, updateData, { new: true });

        // If no service found, return an error
        if (!service) {
            return res.status(404).json({ message: 'Service not found.' });
        }

        res.status(200).json(service);
    } catch (error) {
        // Handle potential errors during service update
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteService = async (req, res) => {
        //1. Find and delete the service
        //2. If no service found, return an error
        //3. Find all bookings related to the service
        //4. Mark all bookings as canceled for the deleted service
    const { serviceId } = req.params; 
    const userId = req.userId
    console.log(userId);

    try {
        
        // const service = await Service.findOneAndDelete({ _id: serviceId, createdBy: userId });

        // if (!service) {
        //     return res.status(404).json({ message: 'Service not found.' });
        // }

        const bookings = await Booking.find({ serviceId }).populate('userId').populate('serviceId');

        await Booking.updateMany({ serviceId }, { status: 'canceled' });
       
            try {
                    await emailService.sendEventCancellation(bookings)

            } catch (error) {
                console.error(error);
            }
        

        res.status(200).json({ message: 'Service deleted, associated bookings canceled, and refund emails sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllBooking = async (req, res) => {
    const adminId = req.userId; // Assuming req.userId is the admin ID
    const { page = 1, limit = 10, sortBy = 'bookingDate', sortOrder = 'asc' } = req.query;

    try {
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Find bookings where adminId matches the logged-in user's ID
        const bookings = await Booking.find({ adminId }) // Filter bookings by adminId
            .populate('serviceId') // Populate serviceId to access service details
            .sort(sortOptions) // Apply sorting
            .skip((page - 1) * limit) // Pagination: skip results
            .limit(Number(limit)); // Pagination: limit results

        // Optionally, get the total count of filtered bookings
        const totalBookings = await Booking.countDocuments({ adminId });
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
        const obj = await authService.createUser(name, email, password, true)
        obj.message = 'Account Created Successfully'
        return res.status(201).json(obj)
    } catch (error) {
        return res.status(error.status).json(error)
    }

};