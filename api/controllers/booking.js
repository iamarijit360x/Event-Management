const Service = require('../models/Service');
const Booking = require('../models/Booking');
const emailService = require('../services/emailService');
const User = require('../models/User');
const bookingService = require('../services/bookingService');
exports.createBooking = async (req, res) => {
    const { serviceId, bookingDates } = req.body; 
    const numberOfDays = bookingDates.length;
    const userId = req.userId;

    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Normalize dates to YYYY-MM-DD format for comparison
        const normalizedBookingDates = bookingService.normalizeDates(bookingDates);  
        const normalizedAvailableDates = bookingService.normalizeDates(service.availableDates); 

        // Check for date availability
        const unavailableDates = bookingService.compareDates(normalizedBookingDates, normalizedAvailableDates);
        if (unavailableDates.length > 0) {
            return res.status(409).json({
                message: 'Some booking dates are not available',
                unavailableDates,
                availableDates: normalizedAvailableDates
            });
        }

        // Update the service's available dates
        service.availableDates = bookingService.compareDates(normalizedAvailableDates, normalizedBookingDates);
        await service.save(); // Save the updated service

        const booking = new Booking({
            userId,
            serviceId,
            bookingDates: normalizedBookingDates, // Store normalized booking dates
            totalPrice: service.pricePerDay * numberOfDays,
            adminId: service.createdBy // Set adminId to service's createdBy
        });

        let newBooking = await booking.save();

        // Populate specific fields from serviceId and userId
        newBooking = await newBooking.populate([
            { path: 'serviceId', select: 'title pricePerDay contactDetails location description' }, 
            { path: 'userId', select: 'name email' }, 
            { path: 'adminId', select: 'name email' } 
        ]);

        await emailService.sendBookingConfirmation(newBooking);
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        console.log(error)
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

