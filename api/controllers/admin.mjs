import Service from '../models/Service.mjs';

export const createService = async (req, res) => {
    const { title, category, pricePerDay, description, availability, contactDetails } = req.body;

    try {
        const service = await Service.create({ title, category, pricePerDay, description, availability, contactDetails });
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

