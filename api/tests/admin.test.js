const request = require('supertest');
const app = require('../app'); // Adjust the path as needed
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Mock the models and services
jest.mock('../models/Booking');
jest.mock('../models/Service');
jest.mock('../services/authService');
jest.mock('../services/emailService');
const serviceData = {
    title: 'Italian Cooking Class',
    category: 'cooking',
    pricePerDay: 75,
    description: 'Learn to cook authentic Italian dishes from scratch.',
    availableDates: ['2024-11-10', '2024-11-11'],
    location: 'Kolkata',
    contactDetails: {
        email: 'classes@culinaryarts.com',
        phone: '+14155567890'
    }
};

let token;

beforeAll(async () => {
    const payload = {
        _id: '67136a4909c318bcf3bfeb4c',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        isAdmin: true
    };

    token = await jwt.sign(payload, process.env.SECRET, {
        expiresIn: '72h'
    });
});

// Mock the auth middleware to set req.user with the token payload

describe('Admin Controller', () => {
    // Test for createService
    describe('POST /api/admin/service', () => {
        it('should create a service and return 201', async () => {
            
            // Manually add createdBy to service data
            const expectedResponse = {
                ...serviceData
            };

            // Mock the service creation with the added createdBy field
            Service.create.mockResolvedValue(expectedResponse);

            const response = await request(app)
                .post('/api/admin/service')
                .set('Authorization', `${token}`) // Set your token here
                .send(serviceData);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(expectedResponse);
            expect(Service.create).toHaveBeenCalledWith({
                ...serviceData
            });
        });

        it('should return 500 on server error', async () => {
            const serviceData = {
                title: 'Italian Cooking Class',
                category: 'cooking',
                pricePerDay: 75,
                description: 'Learn to cook authentic Italian dishes from scratch.',
                availableDates: ['2024-11-10', '2024-11-11'],
                location: 'Kolkata',
                contactDetails: {
                    email: 'classes@culinaryarts.com',
                    phone: '+14155567890'
                }};
            Service.create.mockRejectedValue(new Error('Database error'));
            
            const response = await request(app)
                .post('/api/admin/service')
                .set('Authorization', `${token}`)
                .send(serviceData);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server error');
        });
    });

    // Test for editService
    describe('PUT /api/admin/service/:serviceId', () => {
        it('should update a service and return 200', async () => {
            const serviceId = '67136a4909c318bcf3bfeb4c';
            const updateData = { title: 'Updated Title' };

            Service.findOneAndUpdate.mockResolvedValue({ _id: serviceId, ...updateData });

            const response = await request(app)
                .put(`/api/admin/service/${serviceId}`)
                .set('Authorization', `${token}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ _id: serviceId, ...updateData });
            expect(Service.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: serviceId },
                updateData,
                { new: true }
            );
        });

        it('should return 404 when service is not found', async () => {
            const serviceId = '67136a4909c318bcf3bfeb4c';
            Service.findOneAndUpdate.mockResolvedValue(null); // Simulate service not found

            const response = await request(app)
                .put(`/api/admin/service/${serviceId}`)
                .set('Authorization', `${token}`)
                .send({ title: 'Updated Title' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Service not found.');
        });
    });

    // Test for getAllBooking
    

    // Test for signup
    describe('POST /api/admin/auth/signup', () => {
        it('should create an admin account and return 201', async () => {
            const mockAdmin = { name: 'Admin', email: 'admin@example.com', password: 'Admin@123' };
            const mockResponse = { message: 'Account Created Successfully', isAdmin: true };

            authService.createUser.mockResolvedValue(mockResponse);

            const response = await request(app)
                .post('/api/admin/auth/signup')
                .send(mockAdmin);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockResponse);
            expect(authService.createUser).toHaveBeenCalledWith(mockAdmin.name, mockAdmin.email, mockAdmin.password, true);
        });

        it('should return error on signup failure', async () => {
            authService.createUser.mockRejectedValue({ status: 400, message: 'Validation error' });

            const response = await request(app)
                .post('/api/admin/auth/signup')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid Data Provided');
        });
    });
});
