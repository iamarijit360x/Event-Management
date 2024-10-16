import User from '../models/User.mjs';
import UtilityService from '../services/utilsService.mjs';
import bcrypt from 'bcrypt';
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({ name, email, password });
        const token=await UtilityService.generateToken(user);
        res.status(201).json({token});
    } catch (error) {
        if (error.code === 11000) 
            return res.status(429).json({ message: 'Email already exists. Please use another email.' }); 
        return res.status(500).json({ message: error.message });
    }
};
  
export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token=await UtilityService.generateToken(user);
        return res.status(200).json({ token });
    } 
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
   
};
  
