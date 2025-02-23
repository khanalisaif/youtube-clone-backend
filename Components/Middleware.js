import jwt from 'jsonwebtoken';
import User from './Models/User.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = await User.findById(decoded.id).select('-password'); 

    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};



export default authenticateUser;