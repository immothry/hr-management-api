const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true, index: true },
  checkInTime: { type: Date, default: null },
  checkOutTime: { type: Date, default: null },
  status: { type: String, enum: ['pending', 'full_day', 'half_day', 'absent'], default: 'pending' },
  halfDayReason: { type: String }, // e.g., 'Late check-in', 'Early check-out', 'No checkout'
}, { timestamps: true });

// Ensure unique attendance per user per date
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);