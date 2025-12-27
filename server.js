const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const { startAttendanceCron } = require('./cron/attendanceCron');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const salaryRoutes = require('./routes/salaryRoutes');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();

    startAttendanceCron();

    const app = express();
    app.use(express.json());
    app.use(morgan('dev'));

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/attendance', attendanceRoutes);
    app.use('/api/salary', salaryRoutes);

    app.get('/health', (req, res) => res.json({ status: 'ok' }));

    app.use(errorHandler);

    app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();