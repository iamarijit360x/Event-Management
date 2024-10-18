const User = require('../models/User');
const authService = require('../services/authService');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const obj=await authService.createUser(name, email, password)
        obj.message='Account Created Successfully'
        return res.status(201).json(obj)
    } catch (error) {
       return res.status(error.status).json(error)
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = await authService.generateToken(user);
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
