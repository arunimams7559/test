const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const bcrypt = require('bcrypt');



router.post('/signup', async (req, res) => {
  const { email, password, username, avatar } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      email, 
      password: hashedPassword, 
      username,
      avatar: avatar || `https://avatar.iran.liara.run/public/${Math.random() > 0.5 ? 'boy' : 'girl'}`,
      isOnline: true,
      lastActive: new Date()
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'User created successfully', 
      user: { 
        email, 
        username, 
        _id: user._id, 
        avatar: user.avatar,
        isOnline: user.isOnline
      } 
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});



router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Update user to online status
    user.isOnline = true;
    user.lastActive = new Date();
    await user.save();

    res.status(200).json({ 
      message: 'Login successful', 
      user: { 
        email: user.email, 
        username: user.username, 
        _id: user._id,
        avatar: user.avatar,
        isOnline: user.isOnline
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});


router.post('/logout', async (req, res) => {
  const { userId } = req.body;
  
  if (userId) {
    try {
      await User.findByIdAndUpdate(userId, { 
        isOnline: false,
        lastActive: new Date()
      });
    } catch (err) {
      console.error('Error updating user status on logout:', err);
    }
  }
  
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;