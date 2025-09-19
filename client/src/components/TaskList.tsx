import React from 'react';
import { SynchronizationTask } from '../types/SynchronizationTask';

interface TaskListProps {
  tasks: SynchronizationTask[];
  onEdit: (task: SynchronizationTask) => void;
  onDelete: (id: number) => void;
  onToggleEnabled: (id: number) => void;
  isLoading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onEdit, 
  onDelete, 
  onToggleEnabled, 
  isLoading 
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <span className="status-badge status-pending">Pending</span>;
    
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return <span className="status-badge status-success">Success</span>;
      case 'error':
      case 'failed':
        return <span className="status-badge status-error">Error</span>;
      default:
        return <span className="status-badge status-pending">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Tasks Found</h3>
        <p>Create your first synchronization task to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Destination Table</th>
            <th>Frequency</th>
            <th>Execution Time</th>
            <th>Batch Size</th>
            <th>Status</th>
            <th>Last Run</th>
            <th>Enabled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.taskId}>
              <td>{task.taskId}</td>
              <td>
                <div>
                  <strong>{task.destinationTableName}</strong>
                  {task.query && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      {task.query.length > 50 
                        ? `${task.query.substring(0, 50)}...` 
                        : task.query
                      }
                    </div>
                  )}
                </div>
              </td>
              <td>
                {task.frequency}
                {task.dayValue && (
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Day: {task.dayValue}
                  </div>
                )}
              </td>
              <td>{task.executionTime}</td>
              <td>{task.batchSize.toLocaleString()}</td>
              <td>{getStatusBadge(task.lastRunStatus)}</td>
              <td>
                <div>
                  <div>{formatDate(task.lastRunTime)}</div>
                  {task.errorMessage && (
                    <div style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>
                      {task.errorMessage.length > 30 
                        ? `${task.errorMessage.substring(0, 30)}...` 
                        : task.errorMessage
                      }
                    </div>
                  )}
                </div>
              </td>
              <td>
                <span className={`status-badge ${task.isEnabled ? 'status-enabled' : 'status-disabled'}`}>
                  {task.isEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                  >
                    Edit
                  </button>
                  <button
                    className={`btn btn-sm ${task.isEnabled ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => onToggleEnabled(task.taskId)}
                    title={task.isEnabled ? 'Disable task' : 'Enable task'}
                  >
                    {task.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(task.taskId)}
                    title="Delete task"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
