const Service = require('../models/Service');
const Booking = require('../models/Booking');
const emailService = require('../services/emailService');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
    const { serviceId, bookingDates } = req.body; 
    const numberOfDays = bookingDates.length;
    const userId = req.userId;

    if (!serviceId || !bookingDates || numberOfDays === 0) {
        return res.status(400).json({ message: 'Invalid request: serviceId and bookingDates are required.' });
    }

    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Normalize dates to YYYY-MM-DD format for comparison
        const normalizedBookingDates = bookingDates.map((date) => new Date(date).toISOString().split('T')[0]);
        const normalizedAvailableDates = service.availableDates.map((date) => new Date(date).toISOString().split('T')[0]);

        // Check for date availability
        const unavailableDates = normalizedBookingDates.filter((date) => !normalizedAvailableDates.includes(date));
        if (unavailableDates.length > 0) {
            return res.status(400).json({
                message: 'Some booking dates are not available',
                unavailableDates,
                availableDates: normalizedAvailableDates
            });
        }

        // Update the service's available dates
        service.availableDates = normalizedAvailableDates.filter((date) => !normalizedBookingDates.includes(date));
        await service.save(); // Save the updated service

        const booking = new Booking({
            userId,
            serviceId,
            bookingDates: normalizedBookingDates, // store normalized booking dates
            totalPrice: service.pricePerDay * numberOfDays 
        });

        let newBooking = await booking.save();
        newBooking = await newBooking.populate(['serviceId', 'userId']);
        console.log(newBooking);        
        await emailService.sendBookingConfirmation(newBooking);
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getUserBookings = async (req, res) => {
    const userId = req.userId;
    const { page = 1, limit = 10, sortBy = 'bookingDate', sortOrder = 'asc' } = req.query; // Add query parameters

    try {
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1; // Set sorting order

        const bookings = await Booking.find({ userId })
            .populate('serviceId')
            .sort(sortOptions) // Apply sorting
            .skip((page - 1) * limit) // Calculate how many documents to skip
            .limit(Number(limit)); // Limit the number of results

        // Optionally, get the total count of bookings
        const totalBookings = await Booking.countDocuments({ userId });
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

