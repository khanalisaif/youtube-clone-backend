import express from 'express';
import { 
    uploadVideo, 
    updateVideo, 
    deleteVideo, 
    getVideos, 
    getVideoById, 
    getVideosByCategory, 
} from '../Controllers/VideoController.js';
import authenticateUser from '../Middleware.js';


const Vrouter = express.Router();



Vrouter.post('/upload',authenticateUser, uploadVideo);

Vrouter.put('/update/:id',authenticateUser, updateVideo);

Vrouter.delete('/delete/:id',authenticateUser, deleteVideo);

Vrouter.get('/all',authenticateUser, getVideos);

Vrouter.get('/:id',authenticateUser, getVideoById);

Vrouter.get('/category/:category',authenticateUser, getVideosByCategory);


export default Vrouter;