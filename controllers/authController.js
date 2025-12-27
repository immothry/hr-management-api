const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ status: 'error', message: 'Email and password are required' });

    // password is select:false in schema so select it explicitly
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ status: 'error', message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ status: 'error', message: 'Invalid email or password' });

    const token = generateToken({ id: user._id.toString(), role: user.role });

    const safeUser = await User.findById(user._id).select('-password');

    res.json({ status: 'success', token, user: safeUser });
  } catch (err) {
    console.error('authController.login error:', err);
    res.status(500).json({ status: 'error', message: 'Server error during login' });
  }
};