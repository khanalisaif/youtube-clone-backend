import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  channelName: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  video: { type: Number, default: 0 },
  subscribers: { type: Number, default: 0 },
  subscribedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subscribedChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  timestamp: { type: Date, default: Date.now },
});



export default mongoose.model('User', userSchema);