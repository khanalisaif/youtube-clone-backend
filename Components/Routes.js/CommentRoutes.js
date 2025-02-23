import express from 'express';
import { addComment, deleteComment, editComment, getComments } from '../Controllers/CommentController.js';
import authenticateUser from '../Middleware.js';

const Crouter = express.Router();



Crouter.post('/new', authenticateUser, addComment);

Crouter.delete('/delete/:id', authenticateUser, deleteComment);

Crouter.put('/edit/:id',authenticateUser, editComment);

Crouter.get('/video/:video_id',authenticateUser, getComments);

export default Crouter;