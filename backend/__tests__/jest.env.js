require('dotenv').config();

if (!process.env.MONGODB_URI) {
  throw new Error(
    'MONGODB_URI must be set when running tests (e.g. mongodb://127.0.0.1:27017/task-manager-test)'
  );
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'jest-test-jwt-secret-do-not-use-in-production';
}
