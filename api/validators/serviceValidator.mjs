import { body } from 'express-validator';

// Validation schema for service creation
const serviceValidator = [
    body('title')
        .isString()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be a string between 3 and 100 characters long.')
        .notEmpty()
        .withMessage('Title is required.'),
  
    body('category')
        .isString()
        .isIn(['venue', 'caterer', 'DJ', 'cameraman', 'hotel'])
        .withMessage('Category must be one of the following: venue, caterer, DJ, cameraman, hotel.')
        .notEmpty()
        .withMessage('Category is required.'),
  
    body('pricePerDay')
        .isNumeric()
        .isFloat({ min: 0 })
        .withMessage('Price per day must be a positive number.')
        .notEmpty()
        .withMessage('Price per day is required.'),
  
    body('description')
        .isString()
        .isLength({ min: 10, max: 500 })
        .withMessage('Description must be a string between 10 and 500 characters long.')
        .notEmpty()
        .withMessage('Description is required.'),
  
    body('availability')
        .isArray()
        .withMessage('Availability must be an array.')
        .notEmpty()
        .withMessage('Availability is required.')
        .custom((value) => {
            // Check that all items in the array are valid dates
            for (let date of value) {
                if (isNaN(new Date(date).getTime())) {
                    throw new Error('Each availability date must be a valid date.');
                }
            }
            return true;
        }),

    body('contactDetails')
        .isString()
        .notEmpty()
        .withMessage('Contact details are required.')
];

export default serviceValidator;
