import User from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export const signup = async (req, res) => {
  // unnecessary comment 
  try {
    const {name , channelName, email, phone, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ channelName }, { email }],
    });

    if (existingUser) {
      if (existingUser.channelName === channelName) {
        return res.status(400).json({ error: 'Channel name already exists' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already exists' });
      }
     
      
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({name, channelName,  email, phone, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//chanel name nhi rahega agar bad m user chanel bna na jai tab usko create channel ka option milega


export const login = async (req, res) => {
  try {
    console.log("JWT_SECRET:", process.env.JWT_SECRET); 

    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT_SECRET is missing in environment variables' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const userObject = user.toObject();

    delete userObject.password;

    res.json({ token, user: userObject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = { ...req.body }; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { channelName, email, phone } = updateData;

    

    const existingData = await User.findOne({
         $or: [{ channelName }, { email }, { phone }] 
      
    });

    if (existingData) {
      if (existingData.channelName === channelName) {
        return res.status(400).json({ error: 'Channel name already exists' });
      }
      if (existingData.email === email) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      if (existingData.phone === phone) {
        return res.status(400).json({ error: 'Phone already exists' });
      }
      
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userWithoutPassword = updatedUser.toObject();
    delete userWithoutPassword.password;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating profile:', error); 
    res.status(500).json({ error: error.message });
  }
};





export const subscribe = async (req, res) => {
  try {
    const { channelName } = req.body;
    const userId = req.user.id.toString(); 

    const user = await User.findById(userId);
    
    const channel = await User.findOne({ channelName: channelName });

    if (!user || !channel) {
      return res.status(404).json({ message: 'User or channel not found' });
    }

    if (user.subscribedChannels.includes(channel._id.toString())) {
      return res.status(400).json({ message: 'User is already subscribed to this channel' });
    }

    user.subscribedChannels.push(channel._id.toString());

    channel.subscribers += 1;
    channel.subscribedBy.push(userId);

    await user.save();
    await channel.save();

    res.json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
