import Video from '../Models/Video.js';
import User from '../Models/User.js';



export const uploadVideo = async (req, res) => {
  try {
    const { video_url, thumbnail_url, category, tags } = req.body;
    const user_id = req.user.id.toString();


    const userExists = await User.findById(user_id);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const video = new Video({ user_id, video_url, thumbnail_url, category, tags });
    await video.save();

    userExists.video += 1;


    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params; 
    
    const userId = req.user._id; 

    console.log("Authenticated User ID:", userId);

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (!video.user_id) {
      return res.status(500).json({ error: "Video does not have an owner (user_id missing)" });
    }

    if (video.user_id.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not authorized to update this video" });
    }

    const updatedVideo = await Video.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedVideo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};





export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; 

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    if (video.user_id.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this video' }); 
    }

    await Video.findByIdAndDelete(id);
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





export const getVideos = async (req, res) => {
  try {
     const userId = req.user._id.toString();
        console.log("Extracted User ID:", userId);
    
        const user = await User.findById(userId);
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized: User does not exist' });
        }
    const videos = await Video.find().populate('user_id', 'channelName');
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();
        console.log("Extracted User ID:", userId);
    
        const user = await User.findById(userId);
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized: User does not exist' });
        }
    const video = await Video.findById(id).populate('user_id', 'channelName');
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





export const getVideosByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.user._id.toString();
    console.log("Extracted User ID:", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User does not exist' });
    }
    const videos = await Video.find({ category });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

