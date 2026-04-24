const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ updatedAt: -1 });
    return res.json(tasks);
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description != null ? String(description).trim() : '',
      status,
      priority,
      dueDate: dueDate != null && dueDate !== '' ? new Date(dueDate) : null,
      user: req.userId,
    });

    return res.status(201).json(task);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await Task.findOne({ _id: id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json(task);
  } catch (err) {
    return next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const { title, description, status, priority, dueDate } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = String(title).trim();
    if (description !== undefined) updates.description = String(description).trim();
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) {
      updates.dueDate = dueDate === null || dueDate === '' ? null : new Date(dueDate);
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json(task);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await Task.findOneAndDelete({ _id: id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
