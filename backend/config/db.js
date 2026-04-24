const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  mongoose.set('strictQuery', true);

  const options = process.env.JEST_WORKER_ID
    ? { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 }
    : {};

  await mongoose.connect(uri, options);
  console.log('MongoDB connected');
  return mongoose.connection;
}

module.exports = { connectDB };
