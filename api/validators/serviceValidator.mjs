import { body } from 'express-validator';

const serviceValidator = [
    body('title')
        .notEmpty().withMessage('Title is required'),

    body('category')
        .notEmpty().withMessage('Category is required'),
    body('pricePerDay')
        .isNumeric().withMessage('Price must be a number')
        .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    body('description')
        .optional().isString().withMessage('Description must be a string'),
    body('availabilityDates')
        .optional().isArray().withMessage('Availability dates must be an array')
        .custom((value) => {
            if (value && !value.every((date) => !isNaN(Date.parse(date)))) {
                throw new Error('All availability dates must be valid dates');
            }
            return true;
        }),
    body('location')
        .notEmpty().withMessage('Location is required'),
    body('contactDetails')
        .isObject().withMessage('Contact details must be an object')
        .notEmpty().withMessage('Contact details are required')
        .custom((value) => {
            if (!value.email || !value.phone) {
                throw new Error('Email and phone are required in contact details');
            }
            return true;
        }),
    body('contactDetails.email')
        .isEmail().withMessage('Must be a valid email address'),
    body('contactDetails.phone')
        .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Phone number must be valid')
];
export default serviceValidator ;
