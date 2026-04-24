const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Task = require('../models/Task');

describe('Tasks API (integration)', () => {
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
    await Task.deleteMany({});
  });

  it('creating a task requires auth', async () => {
    await request(app).post('/api/tasks').send({ title: 'Unauthorized task' }).expect(401);
  });

  it('authenticated user can create a task (201)', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Task Owner',
      email: 'owner@example.com',
      password: 'password123',
    });

    const token = reg.body.token;

    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'My first task',
        description: 'Do the thing',
        status: 'pending',
        priority: 'high',
      })
      .expect(201);

    expect(res.body.title).toBe('My first task');
    expect(res.body.description).toBe('Do the thing');
    expect(res.body.status).toBe('pending');
    expect(res.body.priority).toBe('high');
    expect(res.body.user).toBeDefined();
  });

  it('authenticated user can get their tasks', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Lister',
      email: 'lister@example.com',
      password: 'password123',
    });
    const token = reg.body.token;

    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task A' });

    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task B' });

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    const titles = res.body.map((t) => t.title).sort();
    expect(titles).toEqual(['Task A', 'Task B']);
  });

  it('user cannot access another user\'s task', async () => {
    const userA = await request(app).post('/api/auth/register').send({
      name: 'User A',
      email: 'usera@example.com',
      password: 'password123',
    });
    const tokenA = userA.body.token;

    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Secret task for A' })
      .expect(201);

    const taskId = createRes.body._id;

    const userB = await request(app).post('/api/auth/register').send({
      name: 'User B',
      email: 'userb@example.com',
      password: 'password123',
    });
    const tokenB = userB.body.token;

    await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(404);
  });
});
