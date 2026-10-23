require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Clean, industry-standard JWT handling

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your_jwt_secret_key_123';

// --- MONGOOSE DATABASE CONNECTION ---
mongoose.connect(process.env.MONGODB_URI )
  .then(() => console.log("MongoDB Atlas Connected Successfully"))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- USER SCHEMA & MODEL ---
const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  phone:     { type: String },
  age:       { type: Number },
  gender:    { type: String },
  course:    { type: String },
  time_slot: { type: String },
  role:      { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

// --- AUTHENTICATION MIDDLEWARES ---
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin rights required' });
  }
};

// --- AUTH ROUTES ---

// 1. Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { full_name, email, password, phone, age, gender, course, time_slot } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      full_name,
      email,
      password: hashedPassword,
      phone,
      age,
      gender,
      course,
      time_slot,
      role: 'user'
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// 2. Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// --- USER DASHBOARD ROUTES ---

// 3. Get Logged-in User Profile
app.get('/api/user/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Update Logged-in User Profile
app.put('/api/user/profile', auth, async (req, res) => {
  try {
    const { full_name, phone, age, gender, course, time_slot } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { full_name, phone, age, gender, course, time_slot },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// 5. Public Student List for User Panel
app.get('/api/users/list', auth, async (req, res) => {
  try {
    const users = await User.find().select('full_name course time_slot');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user list' });
  }
});

// --- ADMIN ROUTES ---

// 6. Get All Users (Admin Panel)
app.get('/api/admin/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all users' });
  }
});

// 7. Update Any User Information (Admin Panel Edit)
app.put('/api/admin/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const { full_name, email, phone, age, gender, course, time_slot, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { full_name, email, phone, age, gender, course, time_slot, role },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

// 8. Delete User (Admin Panel)
app.delete('/api/admin/users/:id', auth, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));