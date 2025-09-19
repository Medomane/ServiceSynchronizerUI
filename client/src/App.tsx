import React, { useState, useEffect } from 'react';
import { SynchronizationTask, CreateTaskData, UpdateTaskData } from './types/SynchronizationTask';
import { synchronizationTaskService } from './services/api';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<SynchronizationTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<SynchronizationTask | undefined>();
  const [alert, setAlert] = useState<{ type: 'success' | 'danger' | 'info'; message: string } | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const tasksData = await synchronizationTaskService.getAll();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
      showAlert('danger', 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'danger' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleCreateTask = async (taskData: CreateTaskData) => {
    try {
      setIsFormLoading(true);
      const newTask = await synchronizationTaskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      setShowForm(false);
      showAlert('success', 'Task created successfully');
    } catch (error: any) {
      console.error('Error creating task:', error);
      showAlert('danger', error.response?.data?.message || 'Failed to create task');
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleUpdateTask = async (taskData: CreateTaskData) => {
    if (!editingTask) return;

    try {
      setIsFormLoading(true);
      const updatedTask = await synchronizationTaskService.update(editingTask.taskId, taskData);
      setTasks(prev => prev.map(task => 
        task.taskId === editingTask.taskId ? updatedTask : task
      ));
      setShowForm(false);
      setEditingTask(undefined);
      showAlert('success', 'Task updated successfully');
    } catch (error: any) {
      console.error('Error updating task:', error);
      showAlert('danger', error.response?.data?.message || 'Failed to update task');
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await synchronizationTaskService.delete(id);
      setTasks(prev => prev.filter(task => task.taskId !== id));
      showAlert('success', 'Task deleted successfully');
    } catch (error: any) {
      console.error('Error deleting task:', error);
      showAlert('danger', error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleToggleEnabled = async (id: number) => {
    try {
      const updatedTask = await synchronizationTaskService.toggleEnabled(id);
      setTasks(prev => prev.map(task => 
        task.taskId === id ? updatedTask : task
      ));
      showAlert('success', `Task ${updatedTask.isEnabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error: any) {
      console.error('Error toggling task:', error);
      showAlert('danger', error.response?.data?.message || 'Failed to toggle task');
    }
  };

  const handleEditTask = (task: SynchronizationTask) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleNewTask = () => {
    setEditingTask(undefined);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="d-flex justify-content-between align-items-center">
          <h1>Synchronization Tasks Manager</h1>
          <button 
            className="btn btn-primary"
            onClick={handleNewTask}
            disabled={isLoading}
          >
            Create New Task
          </button>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button className="close" onClick={handleCancelForm}>&times;</button>
            </div>
            <div className="card-body">
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                onCancel={handleCancelForm}
                isLoading={isFormLoading}
              />
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          Synchronization Tasks ({tasks.length})
        </div>
        <div className="card-body">
          <TaskList
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleEnabled={handleToggleEnabled}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
