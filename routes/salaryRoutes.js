// src/routes/salaryRoutes.js
// Salary calculation and retrieval routes.

const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const { authMiddleware, permitRoles } = require('../middlewares/authMiddleware');

// POST /api/salary/calculate/:userId/:month/:year  (hr/admin/super_admin)
router.post('/calculate/:userId/:month/:year', authMiddleware, permitRoles('hr', 'admin', 'super_admin'), salaryController.calculateSalary);

// GET /api/salary/me/:month/:year  (employee -> own salary)
router.get('/me/:month/:year', authMiddleware, permitRoles('employee', 'hr', 'admin', 'super_admin'), salaryController.getMySalary);

// GET /api/salary/:userId/:month/:year  (hr/admin)
router.get('/:userId/:month/:year', authMiddleware, permitRoles('hr', 'admin', 'super_admin'), salaryController.getSalaryForUser);

module.exports = router;