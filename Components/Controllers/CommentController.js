import Comment from '../Models/Comment.js';
import User from '../Models/User.js';
import Video from '../Models/Video.js';



export const addComment = async (req, res) => {
  try {
    const { video_id, commentText } = req.body;
    const user_id = req.user.id;

    const video = await Video.findById(video_id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const comment = new Comment({ video_id, commentText, user_id });
    await comment.save();

    video.Comment += 1;

    if (!video.CommentBy.includes(user_id)) {
      video.CommentBy.push(user_id);
    }

    await video.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id.toString();

    console.log("Extracted User ID:", userId);

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const video = await Video.findById(comment.video_id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    console.log("Comment Owner ID:", comment.user_id?.toString());
    console.log("Video Owner ID:", video.user_id?.toString());

    if (comment.user_id?.toString() !== userId && video.user_id?.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized: You do not have permission to delete this comment" });
    }

    await Comment.findByIdAndDelete(id);

    video.Comment = Math.max(0, video.Comment - 1);

    video.CommentBy = video.CommentBy.filter(uid => uid && uid.toString() !== userId);

    await video.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error in deleteComment:", error);
    res.status(500).json({ error: error.message });
  }
};




export const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const comment = await Comment.findById(id);

    console.log("Comment Data:", comment);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (!comment.user_id) {
      return res.status(400).json({ error: "Comment does not have a user_id" });
    }

    if (comment.user_id.toString() !== userId.toString()) {
      return res.status(403).json({
        error: "Unauthorized: You do not have permission to edit this comment",
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(200).json(updatedComment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




export const getComments = async (req, res) => {
  try {
    const { video_id } = req.params;
    const userId = req.user._id.toString();
    console.log("Extracted User ID:", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User does not exist' });
    }

    const comments = await Comment.find({ video_id }).populate('user_id', 'channelName');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};