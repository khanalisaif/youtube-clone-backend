import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
  commentText: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Comment', commentSchema);