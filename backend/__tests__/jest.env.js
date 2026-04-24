require('dotenv').config();

if (!process.env.MONGO_URI_TEST) {
  throw new Error(
    'MONGO_URI_TEST must be set when running tests (e.g. mongodb://127.0.0.1:27017/task-manager-test)'
  );
}

process.env.MONGODB_URI = process.env.MONGO_URI_TEST;

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'jest-test-jwt-secret-do-not-use-in-production';
}
