
const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const Message = require('../models/messagemodel');


router.get('/users', async (req, res) => {
  const currentUserId = req.query.exclude;
  try {
    const users = await User.find(
      currentUserId ? { _id: { $ne: currentUserId } } : {},
      'username _id'
    );
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err });
  }
});


router.post('/messages', async (req, res) => {
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
      .populate('senderId', 'username');

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err });
  }
});

module.exports = router; 
