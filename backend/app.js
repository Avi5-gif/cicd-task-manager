const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(' ') || 'Validation error' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate field value' });
  }
  console.error(err);
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  return res.status(status).json({ message });
});

module.exports = app;
