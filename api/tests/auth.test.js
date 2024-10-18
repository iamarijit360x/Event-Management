const request = require('supertest');
const app = require('../app'); // Adjust the path to your Express app
const User = require('../models/User'); // Adjust the path to your User model
const UtilityService = require('../services/utilsService'); // Adjust the path to your utility service

jest.mock('../services/utilsService'); // Mock the utility service

describe('Authentication Tests', () => {
  const signupData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should sign up a new user and return a token', async () => {
    // Mock the User.create method and the token generation
    User.create = jest.fn().mockResolvedValue(signupData);
    UtilityService.generateToken = jest.fn().mockResolvedValue('token123');

    const response = await request(app).post('/api/auth/signup').send(signupData);
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token', 'token123');
    expect(User.create).toHaveBeenCalledWith(signupData);
    expect(UtilityService.generateToken).toHaveBeenCalled();
  });

  it('should return 429 if email already exists', async () => {
    const error = new Error('Duplicate key');
    error.code = 11000;
    User.create = jest.fn().mockRejectedValue(error);

    const response = await request(app).post('/api/auth/signup').send(signupData);

    expect(response.statusCode).toBe(429);
    expect(response.body).toHaveProperty('message', 'Email already exists. Please use another email.');
  });

  it('should return 500 on server error', async () => {
    User.create = jest.fn().mockRejectedValue(new Error('Server Error'));

    const response = await request(app).post('/api/auth/signup').send(signupData);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message', 'Server Error');
  });
});
