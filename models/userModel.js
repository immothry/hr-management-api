const mongoose = require('mongoose');

const EmployeeProfileSchema = new mongoose.Schema({
  designation: String,
  department: String,
  joiningDate: Date,
  baseSalary: { type: Number, default: 0 },
  contactNumber: String
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'hr', 'employee'],
    default: 'employee'
  },
  employeeId: { type: String, unique: true, sparse: true },
  profile: EmployeeProfileSchema,
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
