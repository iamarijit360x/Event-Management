const Booking = require('../models/Booking');
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
    // TODO add a checke of serviceId
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
        
        const service = await Service.findOneAndDelete({ _id: serviceId, createdBy: userId });

        if (!service) {
            return res.status(404).json({ message: 'Service not found.' });
        }

        const bookings = await Booking.find({ serviceId }).populate('userId');

        await Booking.updateMany({ serviceId }, { status: 'canceled' });

        // Initiate refunds for each booking
       
            try {
                // Assuming you have a paymentService that handles refunds
                // await paymentService.initiateRefund(booking._id, booking.totalPrice);

                // // Send refund email to the user
                // await emailService.sendRefundNotification({
                //     bookings
                // });

            } catch (error) {
                console.error(`Failed to process refund for booking ${booking._id}: ${error.message}`);
            }
        

        res.status(200).json({ message: 'Service deleted, associated bookings canceled, and refund emails sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllBooking = async (req, res) => {
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
        const obj = await authService.createUser(name, email, password, true)
        obj.message = 'Account Created Successfully'
        return res.status(201).json(obj)
    } catch (error) {
        return res.status(error.status).json(error)
    }

};