const Service = require('../models/Service');
const Booking = require('../models/Booking');

// Get all services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

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

        await booking.save();

        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

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
    const { minPrice, maxPrice, category, location, bookingDate } = req.query;
    console.log(req.query);
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
        const services = await Service.find(query);
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
