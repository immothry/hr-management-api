// src/routes/userRoutes.js
// User management routes. Role enforcement via permitRoles middleware.

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, permitRoles } = require('../middlewares/authMiddleware');

// Create employee (HR/Admin/Super Admin)
router.post('/employee', authMiddleware, permitRoles('hr', 'admin', 'super_admin'), userController.createEmployee);

// Create HR (Admin/Super Admin)
router.post('/hr', authMiddleware, permitRoles('admin', 'super_admin'), userController.createHR);

// Create Admin (Super Admin)
router.post('/admin', authMiddleware, permitRoles('super_admin'), userController.createAdmin);

// Get all users (HR/Admin/Super Admin)
router.get('/', authMiddleware, permitRoles('hr', 'admin', 'super_admin'), userController.getAllUsers);

// Soft delete user by id
router.delete('/:id', authMiddleware, permitRoles('hr', 'admin', 'super_admin'), userController.archiveUser);

module.exports = router;
