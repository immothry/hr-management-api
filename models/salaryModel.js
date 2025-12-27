const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true }, 
  year: { type: Number, required: true },
  totalWorkingDays: { type: Number, required: true },
  daysPresent: { type: Number, required: true }, 
  halfDays: { type: Number, required: true },
  daysAbsent: { type: Number, required: true },
  netPayableDays: { type: Number, required: true },
  calculatedSalary: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paidOn: { type: Date, default: null }
}, { timestamps: true });

// Prevent duplicate salary for same user/month/year
SalarySchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Salary', SalarySchema);