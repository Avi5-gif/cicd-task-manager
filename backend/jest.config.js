/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/__tests__/jest.env.js'],
  testMatch: ['**/__tests__/**/*.test.js', '**/__tests__/**/*.integration.test.js'],
  testTimeout: 30000,
};
