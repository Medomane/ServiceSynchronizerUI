const { database, sql } = require('../config/database');

class SynchronizationTask {
  constructor() {
    this.tableName = 'SynchronizationTasks';
  }

  async getAll() {
    try {
      const pool = database.getPool();
      const result = await pool.request()
        .query(`
          SELECT
            TaskId as taskId,
            Query as query,
            DestinationTableName as destinationTableName,
            IsEnabled as isEnabled,
            LastRunTime as lastRunTime,
            LastRunStatus as lastRunStatus,
            ErrorMessage as errorMessage,
            Frequency as frequency,
            DayValue as dayValue,
            ExecutionTime as executionTime,
            LastExecutedOn as lastExecutedOn,
            BatchSize as batchSize
          FROM dbo.${this.tableName}
          ORDER BY TaskId DESC
        `);

      return result.recordset.map(task => this.formatTask(task));
    } catch (error) {
      console.error('Error getting all tasks:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const pool = database.getPool();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          SELECT
            TaskId as taskId,
            Query as query,
            DestinationTableName as destinationTableName,
            IsEnabled as isEnabled,
            LastRunTime as lastRunTime,
            LastRunStatus as lastRunStatus,
            ErrorMessage as errorMessage,
            Frequency as frequency,
            DayValue as dayValue,
            ExecutionTime as executionTime,
            LastExecutedOn as lastExecutedOn,
            BatchSize as batchSize
          FROM dbo.${this.tableName}
          WHERE TaskId = @id
        `);

      if (result.recordset.length === 0) {
        return null;
      }

      return this.formatTask(result.recordset[0]);
    } catch (error) {
      console.error('Error getting task by ID:', error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const pool = database.getPool();
      
      let executionTime = taskData.executionTime;
      if (typeof executionTime === 'string') {
        if (executionTime.length === 5) {
          executionTime = executionTime + ':00';
        }
      }
      
      const result = await pool.request()
        .input('query', sql.NVarChar(sql.MAX), taskData.query)
        .input('destinationTableName', sql.NVarChar(255), taskData.destinationTableName)
        .input('isEnabled', sql.Bit, taskData.isEnabled)
        .input('frequency', sql.NVarChar(10), taskData.frequency)
        .input('dayValue', sql.Int, taskData.dayValue)
        .input('executionTime', sql.Time, '00:00:00')
        .input('batchSize', sql.Int, taskData.batchSize)
        .query(`
          INSERT INTO dbo.${this.tableName}
          (Query, DestinationTableName, IsEnabled, Frequency, DayValue, ExecutionTime, BatchSize)
          OUTPUT INSERTED.TaskId as taskId,
                 INSERTED.Query as query,
                 INSERTED.DestinationTableName as destinationTableName,
                 INSERTED.IsEnabled as isEnabled,
                 INSERTED.Frequency as frequency,
                 INSERTED.DayValue as dayValue,
                 INSERTED.ExecutionTime as executionTime,
                 INSERTED.LastExecutedOn as lastExecutedOn,
                 INSERTED.LastRunTime as lastRunTime,
                 INSERTED.LastRunStatus as lastRunStatus,
                 INSERTED.ErrorMessage as errorMessage,
                 INSERTED.BatchSize as batchSize
          VALUES (@query, @destinationTableName, @isEnabled, @frequency, @dayValue, @executionTime, @batchSize)
        `);

      return this.formatTask(result.recordset[0]);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const pool = database.getPool();
      
      let executionTime = taskData.executionTime;
      if (typeof executionTime === 'string') {
        if (executionTime.length === 5) {
          executionTime = executionTime + ':00';
        }
      }
      
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('query', sql.NVarChar(sql.MAX), taskData.query)
        .input('destinationTableName', sql.NVarChar(255), taskData.destinationTableName)
        .input('isEnabled', sql.Bit, taskData.isEnabled)
        .input('frequency', sql.NVarChar(10), taskData.frequency)
        .input('dayValue', sql.Int, taskData.dayValue)
        .input('batchSize', sql.Int, taskData.batchSize)
        .query(`
          UPDATE dbo.${this.tableName}
          SET Query = @query,
              DestinationTableName = @destinationTableName,
              IsEnabled = @isEnabled,
              Frequency = @frequency,
              DayValue = @dayValue,
              BatchSize = @batchSize
          OUTPUT INSERTED.TaskId as taskId,
                 INSERTED.Query as query,
                 INSERTED.DestinationTableName as destinationTableName,
                 INSERTED.IsEnabled as isEnabled,
                 INSERTED.Frequency as frequency,
                 INSERTED.DayValue as dayValue,
                 INSERTED.ExecutionTime as executionTime,
                 INSERTED.LastExecutedOn as lastExecutedOn,
                 INSERTED.LastRunTime as lastRunTime,
                 INSERTED.LastRunStatus as lastRunStatus,
                 INSERTED.ErrorMessage as errorMessage,
                 INSERTED.BatchSize as batchSize
          WHERE TaskId = @id
        `);

      if (result.recordset.length === 0) {
        return null;
      }

      return this.formatTask(result.recordset[0]);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const pool = database.getPool();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          DELETE FROM dbo.${this.tableName}
          WHERE TaskId = @id
        `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async toggleEnabled(id) {
    try {
      const pool = database.getPool();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          UPDATE dbo.${this.tableName}
          SET IsEnabled = CASE WHEN IsEnabled = 1 THEN 0 ELSE 1 END
          OUTPUT INSERTED.TaskId as taskId,
                 INSERTED.Query as query,
                 INSERTED.DestinationTableName as destinationTableName,
                 INSERTED.IsEnabled as isEnabled,
                 INSERTED.Frequency as frequency,
                 INSERTED.DayValue as dayValue,
                 INSERTED.ExecutionTime as executionTime,
                 INSERTED.LastExecutedOn as lastExecutedOn,
                 INSERTED.LastRunTime as lastRunTime,
                 INSERTED.LastRunStatus as lastRunStatus,
                 INSERTED.ErrorMessage as errorMessage,
                 INSERTED.BatchSize as batchSize
          WHERE TaskId = @id
        `);

      if (result.recordset.length === 0) {
        return null;
      }

      return this.formatTask(result.recordset[0]);
    } catch (error) {
      console.error('Error toggling task enabled status:', error);
      throw error;
    }
  }

  formatExecutionTime(timeString) {
    if (!timeString) return null;

    if (typeof timeString === 'string') {
      const timeMatch = timeString.match(/^(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        return `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
      }
    }

    if (timeString instanceof Date) {
      const hours = timeString.getHours().toString().padStart(2, '0');
      const minutes = timeString.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    return timeString;
  }

  formatTask(task) {
    return {
      taskId: task.taskId,
      query: task.query,
      destinationTableName: task.destinationTableName,
      isEnabled: Boolean(task.isEnabled),
      frequency: task.frequency,
      dayValue: task.dayValue,
      executionTime: this.formatExecutionTime(task.executionTime),
      lastExecutedOn: task.lastExecutedOn,
      lastRunTime: task.lastRunTime,
      lastRunStatus: task.lastRunStatus,
      errorMessage: task.errorMessage,
      batchSize: task.batchSize
    };
  }
}

module.exports = SynchronizationTask;
