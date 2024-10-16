import { body } from 'express-validator';

export const bookingValidator = [
    // Validation rules
    body('serviceId').isMongoId().withMessage('Invalid service ID'),
    body('bookingDates').isArray({ min: 1 }).withMessage('Booking dates must be an array with at least one date'),
    body('bookingDates.*').isISO8601().withMessage('Each booking date must be a valid date format')
];
