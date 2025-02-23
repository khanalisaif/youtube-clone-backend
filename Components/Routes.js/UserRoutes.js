import express from 'express';
import { signup, login, updateProfile, subscribe } from '../Controllers/UserController.js';
import authenticateUser from '../Middleware.js';

const Urouter = express.Router();



Urouter.post('/signup', signup);

Urouter.post('/login', login);

Urouter.put('/update/:userId', updateProfile);

Urouter.post('/subscribe', authenticateUser, subscribe);

export default Urouter;