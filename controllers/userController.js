
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const SALT_ROUNDS = 10;

// Helper: create user with hashed password
async function createUser({ name, email, password, role, employeeId, profile }) {
  // Hash password to store securely
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const doc = new User({
    name,
    email: email.toLowerCase(),
    password: hashed,
    role,
    employeeId,
    profile
  });

  await doc.save();
  return await User.findById(doc._id).select('-password');
}

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, employeeId, profile } = req.body;
    if (!name || !email || !password) return res.status(400).json({ status: 'error', message: 'name, email and password are required' });

    const user = await createUser({ name, email, password, role: 'employee', employeeId, profile });
    res.status(201).json({ status: 'success', message: 'Employee user created successfully.', user });
  } catch (err) {
    console.error('userController.createEmployee error:', err);
    if (err.code === 11000) return res.status(409).json({ status: 'error', message: 'Email or employeeId already exists' });
    res.status(500).json({ status: 'error', message: 'Failed to create employee' });
  }
};

exports.createHR = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ status: 'error', message: 'name, email and password are required' });

    const user = await createUser({ name, email, password, role: 'hr' });
    res.status(201).json({ status: 'success', message: 'HR user created successfully.', user });
  } catch (err) {
    console.error('userController.createHR error:', err);
    if (err.code === 11000) return res.status(409).json({ status: 'error', message: 'Email already exists' });
    res.status(500).json({ status: 'error', message: 'Failed to create HR' });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ status: 'error', message: 'name, email and password are required' });

    const user = await createUser({ name, email, password, role: 'admin' });
    res.status(201).json({ status: 'success', message: 'Admin user created successfully.', user });
  } catch (err) {
    console.error('userController.createAdmin error:', err);
    if (err.code === 11000) return res.status(409).json({ status: 'error', message: 'Email already exists' });
    res.status(500).json({ status: 'error', message: 'Failed to create Admin' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const includeArchived = req.query.includeArchived === 'true';
    const filter = includeArchived ? {} : { isArchived: false };
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ status: 'success', users });
  } catch (err) {
    console.error('userController.getAllUsers error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch users' });
  }
};

exports.archiveUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ status: 'error', message: 'User id is required' });

    const user = await User.findByIdAndUpdate(userId, { isArchived: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    res.json({ status: 'success', message: 'User archived', user });
  } catch (err) {
    console.error('userController.archiveUser error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to archive user' });
  }
};