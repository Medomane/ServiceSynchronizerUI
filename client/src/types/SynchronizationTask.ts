export interface SynchronizationTask {
  taskId: number;
  query: string;
  destinationTableName: string;
  isEnabled: boolean;
  lastRunTime?: string;
  lastRunStatus?: string;
  errorMessage?: string;
  frequency: string;
  dayValue?: number;
  executionTime: string;
  lastExecutedOn?: string;
  batchSize: number;
}

export interface CreateTaskData {
  query: string;
  destinationTableName: string;
  isEnabled: boolean;
  frequency: string;
  dayValue?: number;
  batchSize: number;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
