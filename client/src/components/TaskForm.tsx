import React, { useState, useEffect } from 'react';
import { SynchronizationTask, CreateTaskData, UpdateTaskData } from '../types/SynchronizationTask';

interface TaskFormProps {
  task?: SynchronizationTask;
  onSubmit: (taskData: CreateTaskData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<CreateTaskData>({
    query: '',
    destinationTableName: '',
    isEnabled: true,
    frequency: 'daily',
    dayValue: undefined,
    batchSize: 1000
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        query: task.query,
        destinationTableName: task.destinationTableName,
        isEnabled: task.isEnabled,
        frequency: task.frequency,
        dayValue: task.dayValue,
        batchSize: task.batchSize
      });
    }
  }, [task]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.query.trim()) {
      newErrors.query = 'Query is required';
    }

    if (!formData.destinationTableName.trim()) {
      newErrors.destinationTableName = 'Destination table name is required';
    }

    if (!formData.frequency) {
      newErrors.frequency = 'Frequency is required';
    }


    if (!formData.batchSize || formData.batchSize < 1) {
      newErrors.batchSize = 'Batch size must be a positive integer';
    }

    if (formData.frequency === 'weekly' && (!formData.dayValue || formData.dayValue < 1 || formData.dayValue > 7)) {
      newErrors.dayValue = 'Day value must be between 1 and 7 for weekly frequency';
    }

    if (formData.frequency === 'monthly' && (!formData.dayValue || formData.dayValue < 1 || formData.dayValue > 31)) {
      newErrors.dayValue = 'Day value must be between 1 and 31 for monthly frequency';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || undefined : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="query">
          Query *
        </label>
        <textarea
          id="query"
          name="query"
          className={`form-control ${errors.query ? 'is-invalid' : ''}`}
          value={formData.query}
          onChange={handleChange}
          rows={4}
          placeholder="Enter SQL query..."
        />
        {errors.query && <div className="invalid-feedback">{errors.query}</div>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="destinationTableName">
          Destination Table Name *
        </label>
        <input
          type="text"
          id="destinationTableName"
          name="destinationTableName"
          className={`form-control ${errors.destinationTableName ? 'is-invalid' : ''}`}
          value={formData.destinationTableName}
          onChange={handleChange}
          placeholder="Enter destination table name"
        />
        {errors.destinationTableName && <div className="invalid-feedback">{errors.destinationTableName}</div>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="frequency">
          Frequency *
        </label>
        <select
          id="frequency"
          name="frequency"
          className={`form-control ${errors.frequency ? 'is-invalid' : ''}`}
          value={formData.frequency}
          onChange={handleChange}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        {errors.frequency && <div className="invalid-feedback">{errors.frequency}</div>}
      </div>

      {(formData.frequency === 'weekly' || formData.frequency === 'monthly') && (
        <div className="form-group">
          <label className="form-label" htmlFor="dayValue">
            Day Value *
            {formData.frequency === 'weekly' && ' (1=Monday, 7=Sunday)'}
            {formData.frequency === 'monthly' && ' (1-31)'}
          </label>
          <input
            type="number"
            id="dayValue"
            name="dayValue"
            className={`form-control ${errors.dayValue ? 'is-invalid' : ''}`}
            value={formData.dayValue || ''}
            onChange={handleChange}
            min={formData.frequency === 'weekly' ? 1 : 1}
            max={formData.frequency === 'weekly' ? 7 : 31}
          />
          {errors.dayValue && <div className="invalid-feedback">{errors.dayValue}</div>}
        </div>
      )}


      <div className="form-group">
        <label className="form-label" htmlFor="batchSize">
          Batch Size *
        </label>
        <input
          type="number"
          id="batchSize"
          name="batchSize"
          className={`form-control ${errors.batchSize ? 'is-invalid' : ''}`}
          value={formData.batchSize}
          onChange={handleChange}
          min="1"
        />
        {errors.batchSize && <div className="invalid-feedback">{errors.batchSize}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            name="isEnabled"
            checked={formData.isEnabled}
            onChange={handleChange}
          />
          {' '}Enabled
        </label>
      </div>

      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : (task ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
