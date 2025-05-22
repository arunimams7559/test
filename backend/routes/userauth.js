
const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const Message = require('../models/messagemodel');


router.get('/users', async (req, res) => {
  const currentUserId = req.query.exclude;
  try {
    const users = await User.find(
      currentUserId ? { _id: { $ne: currentUserId } } : {},
      'username _id isOnline avatar lastActive'
    );
    res.status(200).json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});


// Update user profile (avatar, etc)
router.put('/profile', async (req, res) => {
  const { userId, avatar } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const updateFields = {};
    if (avatar) updateFields.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, select: 'username email _id avatar isOnline' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated', user });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});


// Save a new message
router.post('/messages', async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ message: 'Missing senderId, receiverId, or content' });
  }

  try {
    // Verify both users exist
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId)
    ]);
    
    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Sender or receiver not found' });
    }
    
    const message = new Message({ senderId, receiverId, content });
    await message.save();
    res.status(201).json({ message: 'Message saved', data: message });
  } catch (err) {
    console.error('Message save error:', err);
    res.status(500).json({ message: 'Failed to save message', error: err.message });
  }
});

// Fetch chat history between two users
router.get('/messages', async (req, res) => {
  const { senderId, receiverId } = req.query;
  if (!senderId || !receiverId) {
    return res.status(400).json({ message: 'Missing senderId or receiverId' });
  }

  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    })
      .sort({ timestamp: 1 })
      .populate('senderId', 'username avatar');

    res.status(200).json({ messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
});

module.exports = router;
