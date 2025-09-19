const express = require('express');
const router = express.Router();
const SynchronizationTask = require('../models/SynchronizationTask');
const { validateCreateTask, validateUpdateTask, validateTaskId } = require('../middleware/validation');

const synchronizationTask = new SynchronizationTask();

router.get('/', async (req, res) => {
  try {
    const tasks = await synchronizationTask.getAll();
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch synchronization tasks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.get('/:id', validateTaskId, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await synchronizationTask.getById(parseInt(id));

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Synchronization task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch synchronization task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/', validateCreateTask, async (req, res) => {
  try {
    const taskData = {
      query: req.body.query,
      destinationTableName: req.body.destinationTableName,
      isEnabled: req.body.isEnabled,
      frequency: req.body.frequency,
      dayValue: req.body.dayValue,
      batchSize: req.body.batchSize
    };

    const newTask = await synchronizationTask.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Synchronization task created successfully',
      data: newTask
    });
  } catch (error) {
    console.error('Error creating task:', error);

    if (error.number === 2627 || error.message.includes('duplicate key')) {
      return res.status(409).json({
        success: false,
        message: 'A task with this destination table name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create synchronization task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.put('/:id', validateUpdateTask, async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = {
      query: req.body.query,
      destinationTableName: req.body.destinationTableName,
      isEnabled: req.body.isEnabled,
      frequency: req.body.frequency,
      dayValue: req.body.dayValue,
      batchSize: req.body.batchSize
    };

    const updatedTask = await synchronizationTask.update(parseInt(id), taskData);

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Synchronization task not found'
      });
    }

    res.json({
      success: true,
      message: 'Synchronization task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);

    if (error.number === 2627 || error.message.includes('duplicate key')) {
      return res.status(409).json({
        success: false,
        message: 'A task with this destination table name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update synchronization task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.delete('/:id', validateTaskId, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await synchronizationTask.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Synchronization task not found'
      });
    }

    res.json({
      success: true,
      message: 'Synchronization task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete synchronization task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.patch('/:id/toggle', validateTaskId, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await synchronizationTask.toggleEnabled(parseInt(id));

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Synchronization task not found'
      });
    }

    res.json({
      success: true,
      message: `Synchronization task ${updatedTask.isEnabled ? 'enabled' : 'disabled'} successfully`,
      data: updatedTask
    });
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle synchronization task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
