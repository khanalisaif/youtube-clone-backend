import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Db.js';
import Urouter from './Routes.js/UserRoutes.js';
import Vrouter from './Routes.js/VideoRoutes.js';
import Crouter from './Routes.js/CommentRoutes.js';

dotenv.config();
console.log(process.env); 

connectDB();

const app = express();
app.use(express.json());

app.use('/api/users', Urouter);
app.use('/api/videos', Vrouter);
app.use('/api/comments', Crouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));