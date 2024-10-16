import jwt from 'jsonwebtoken';

class UtilityService{
    async generateToken(user){
        const payload = {
            id: user._id,  
            email: user.email,
            name: user.name,
            isAdmin:user.isAdmin
        };
        return jwt.sign(payload, process.env.SECRET, {
            expiresIn: '1h'
        });

    }
}
export default new UtilityService();
