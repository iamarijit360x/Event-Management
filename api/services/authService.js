import User from '../models/User.mjs';

export const signup = async (req, res) =>  {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({ name, email, password });
        res.status(201).json({ user, token: generateToken(user._id) });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ token: generateToken(user._id) });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
