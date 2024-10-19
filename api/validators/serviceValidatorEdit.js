const { body, param } = require('express-validator');
const utilsService = require('../services/utilsService');

const validateEditService = [
    param('serviceId')
    .custom(value => {
        if (!utilsService.isObjectId(value)) {
            throw new Error('Invalid ObjectId.');
        }
        return true;
    })
    ,
    body()
        .custom(value => {
        if (Object.keys(value).length === 0) {
            throw new Error('At least one field must be provided for editing.');
        }
        return true;
    }),
    
    body('title')
        .optional()
        .isString()
        .withMessage('Title must be a string.'),
    // Validate category
    body('category')
        .optional()
        .isString()
        .withMessage('Category must be a string.'),
    // Validate pricePerDay
    body('pricePerDay')
        .optional()
        .isFloat({ gt: 0 })
        .withMessage('Price per day must be a number greater than zero.'),
    // Validate description
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string.'),
    // Validate availabilityDates
    body('availabilityDates')
        .optional()
        .isArray()
        .withMessage('Availability dates must be an array of dates.'),
    // Validate location
    body('location')
        .optional()
        .isString()
        .withMessage('Location must be a string.'),
    // Validate contactDetails
    body('contactDetails')
        .optional()
        .isObject()
        .withMessage('Contact details must be an object.')
        .custom(contactDetails => {
            if (!contactDetails.email || !contactDetails.phone) {
                throw new Error('Contact details must include both email and phone.');
            }
            return true;
        })
];

module.exports = { validateEditService };
