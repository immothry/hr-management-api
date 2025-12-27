const cron = require('node-cron');
const Attendance = require('../models/attendanceModel');
const User = require('../models/userModel');

exports.startAttendanceCron = () => {
  cron.schedule('0 20 * * *', async () => {
    const today = new Date().toISOString().slice(0, 10);
    const users = await User.find({ isArchived: false });

    for (const user of users) {
      let record = await Attendance.findOne({ user: user._id, date: today });

      if (!record) {
        await Attendance.create({ user: user._id, date: today, status: 'absent' });
      } else if (!record.checkOutTime) {
        record.status = 'half_day';
        record.halfDayReason = 'No checkout';
        await record.save();
      }
    }

    console.log('✅ Attendance cron executed');
  });
};
