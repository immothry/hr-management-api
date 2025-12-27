const Attendance = require('../models/attendanceModel');

function today() {
  return new Date().toISOString().slice(0, 10);
}

exports.checkIn = async (req, res) => {
  const userId = req.user._id;
  const date = today();

  let attendance = await Attendance.findOne({ user: userId, date });
  if (attendance?.checkInTime) {
    return res.status(400).json({ status: 'error', message: 'Already checked in' });
  }

  if (!attendance) attendance = new Attendance({ user: userId, date });

  attendance.checkInTime = new Date();

  const nineAM = new Date();
  nineAM.setHours(9, 0, 0, 0);

  if (attendance.checkInTime > nineAM) {
    attendance.status = 'half_day';
    attendance.halfDayReason = 'Late check-in';
  }

  await attendance.save();
  res.status(201).json({ status: 'success', attendance });
};

exports.checkOut = async (req, res) => {
  const userId = req.user._id;
  const date = today();

  const attendance = await Attendance.findOne({ user: userId, date });
  if (!attendance || attendance.checkOutTime) {
    return res.status(400).json({ status: 'error', message: 'Invalid checkout' });
  }

  attendance.checkOutTime = new Date();

  const sixPM = new Date();
  sixPM.setHours(18, 0, 0, 0);

  if (attendance.checkOutTime < sixPM) {
    attendance.status = 'half_day';
    attendance.halfDayReason = attendance.halfDayReason
      ? attendance.halfDayReason + ', Early checkout'
      : 'Early checkout';
  } else if (attendance.status !== 'half_day') {
    attendance.status = 'full_day';
  }

  await attendance.save();
  res.json({ status: 'success', attendance });
};

exports.getMonthlyAttendance = async (req, res) => {
  const { month, year } = req.params;
  const prefix = `${year}-${String(month).padStart(2, '0')}`;

  const records = await Attendance.find({
    user: req.user._id,
    date: { $regex: `^${prefix}` }
  }).sort({ date: 1 });

  res.json({ status: 'success', records });
};
