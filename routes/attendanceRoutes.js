const express = require('express');
const router = express.Router();
const controller = require('../controllers/attendanceController');
const { authMiddleware, permitRoles } = require('../middlewares/authMiddleware');

router.post('/check-in', authMiddleware, permitRoles('employee'), controller.checkIn);
router.post('/check-out', authMiddleware, permitRoles('employee'), controller.checkOut);
router.get('/me/:month/:year', authMiddleware, permitRoles('employee'), controller.getMonthlyAttendance);

module.exports = router;
