const User = require("../models/User");
const jwt = require('jsonwebtoken');


class AuthService {
    async generateToken(user) {
        const payload = {
            id: user._id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin
        };
        return jwt.sign(payload, process.env.SECRET, {
            expiresIn: '72h'
        });
    }
    async createUser(name, email, password, isAdmin = false) {
        try {
            const user = await User.create({ name, email, password, isAdmin });
            const token = await this.generateToken(user);
            return { token };
        } catch (error) {
            console.log(error);
            
            if (error.code === 11000) {
                throw ({message:'Email already exists. Please use another email.',error,status:409}); // Simpler error message
            }
            throw new Error({message:'Error While Creating Account',error,status:500}); // General error message
        }
    }
}

module.exports = new AuthService();
