const request = require('supertest');
const app = require('../app'); // Adjust the path as needed
const authService = require('../services/authService');
const User = require('../models/User');
const bcrypt=require('bcrypt')
const mongoose=require('mongoose')
// Mock the authService methods

jest.mock('../services/authService', () => ({
    createUser: jest.fn(),
    generateToken: jest.fn()
}));

// Mock the User model
jest.mock('../models/User');

describe('Auth Controller', () => {
    describe('POST /api/auth/signup', () => {
        it('should return 201 and success message when signup is valid', async () => {
            const mockUser = { name: 'Test User', email: 'test@example.com', password: 'Test@123' };
            const mockResponse = { message: 'Account Created Successfully' };

            authService.createUser.mockResolvedValue(mockResponse);

            const response = await request(app)
                .post('/api/auth/signup')
                .send(mockUser);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Account Created Successfully');
            expect(authService.createUser).toHaveBeenCalledWith(mockUser.name, mockUser.email, mockUser.password);
        });

        it('should return 400 when there is a validation error', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                    email: 'invalid-email', // Invalid email format
                    password: 'short' // Too short password
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid Data Provided'); // Adjust as per your validation response
        });
    });

    describe('POST /api/auth/signin', () => {
      it('should return 200 and token when signin is valid', async () => {
        const mockUser = {
          email: 'test@example.com',
          password: 'Test@123',
          // Include any other user fields needed
        };
        const mockToken = 'some.jwt.token';
    
        // Mock the findOne method to return a user with a hashed password
        const hashedPassword = await bcrypt.hash(mockUser.password, 10);
        User.findOne.mockResolvedValue({
          ...mockUser,
          password: hashedPassword, // Return a user with hashed password
        });
        
        // Mock the generateToken method to return a token
        authService.generateToken.mockResolvedValue(mockToken);
    
        // Send the signin request
        const response = await request(app)
          .post('/api/auth/signin')
          .send({
            email: mockUser.email,
            password: mockUser.password, // Use the original password
          });
    
        // Assertions
        expect(response.status).toBe(200);
        expect(response.body.token).toBe(mockToken);
        expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      });
    
      it('should return 401 when credentials are invalid', async () => {
        User.findOne.mockResolvedValue(null); // Simulate user not found
    
        const response = await request(app)
          .post('/api/auth/signin')
          .send({
            email: 'nonexistent@example.com',
            password: 'wrongpassword',
          });
    
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
      });
    
      it('should return 500 on server error', async () => {
        User.findOne.mockRejectedValue(new Error('Database error')); // Simulate a database error
    
        const response = await request(app)
          .post('/api/auth/signin')
          .send({
            email: 'test@example.com',
            password: 'Test@123',
          });
    
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Database error');
      });
    });
});


