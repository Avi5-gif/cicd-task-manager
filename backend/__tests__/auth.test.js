const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const { connectDB } = require('../config/db');
const User = require('../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
      }
    } finally {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('register creates user and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'register@example.com',
        password: 'password123',
      })
      .expect(201);

    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user).toMatchObject({
      name: 'Test User',
      email: 'register@example.com',
    });
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.createdAt).toBeDefined();

    const user = await User.findOne({ email: 'register@example.com' });
    expect(user).not.toBeNull();
    expect(user.name).toBe('Test User');
  });

  it('login with correct credentials returns token', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'correctpass1',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'correctpass1',
      })
      .expect(200);

    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user).toMatchObject({
      email: 'login@example.com',
      name: 'Login User',
    });
  });

  it('login with wrong password returns 401', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Other',
      email: 'wrongpw@example.com',
      password: 'rightpassword',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrongpw@example.com',
        password: 'wrongpassword',
      })
      .expect(401);

    expect(res.body.message).toBe('Invalid email or password');
    expect(res.body.token).toBeUndefined();
  });
});
