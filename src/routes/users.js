import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: 'OK', data: users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', data: err.message });
  }
});

// 创建新用户
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required', data: null });
    }

    const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json({ message: 'User created', data: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', data: err.message });
  }
});

export default router;