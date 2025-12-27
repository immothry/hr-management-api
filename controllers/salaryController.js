const Attendance = require('../models/attendanceModel');
const Salary = require('../models/salaryModel');
const User = require('../models/userModel');

exports.calculateSalary = async (req, res) => {
  const { userId, month, year } = req.params;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const records = await Attendance.find({
    user: userId,
    date: { $regex: `^${prefix}` }
  });

  let full = 0, half = 0, absent = 0;

  records.forEach(r => {
    if (r.status === 'full_day') full++;
    else if (r.status === 'half_day') half++;
    else absent++;
  });

  const totalWorkingDays = records.length;
  const netPayableDays = full + half * 0.5;
  const dailyRate = (user.profile?.baseSalary || 0) / (totalWorkingDays || 1);

  const salary = await Salary.create({
    user: userId,
    month,
    year,
    totalWorkingDays,
    daysPresent: full,
    halfDays: half,
    daysAbsent: absent,
    netPayableDays,
    calculatedSalary: dailyRate * netPayableDays
  });

  res.json({ status: 'success', salary });
};

exports.getMySalary = async (req, res) => {
  const { month, year } = req.params;
  const salary = await Salary.findOne({ user: req.user._id, month, year });
  res.json({ status: 'success', salary });
};

exports.getSalaryForUser = async (req, res) => {
  const { userId, month, year } = req.params;
  const salary = await Salary.findOne({ user: userId, month, year });
  res.json({ status: 'success', salary });
};
