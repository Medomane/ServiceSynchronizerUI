# Synchronization Tasks Manager

A complete CRUD web application for managing SynchronizationTasks in SQL Server.

## Features

- **Full CRUD Operations**: Create, Read, Update, Delete synchronization tasks
- **Task Management**: Enable/disable tasks, view execution status
- **Modern UI**: Clean, responsive interface built with React and TypeScript
- **SQL Server Integration**: Direct connection to SQL Server database
- **Validation**: Comprehensive form validation and error handling

## Database Schema

The application works with the following SQL Server table:

```sql
CREATE TABLE [SynchronizationTasks](
    [TaskId] [int] IDENTITY(1,1) NOT NULL,
    [Query] [nvarchar](max) NOT NULL,
    [DestinationTableName] [nvarchar](255) NOT NULL,
    [IsEnabled] [bit] NOT NULL,
    [LastRunTime] [datetime] NULL,
    [LastRunStatus] [nvarchar](50) NULL,
    [ErrorMessage] [nvarchar](max) NULL,
    [Frequency] [nvarchar](10) NOT NULL,
    [DayValue] [int] NULL,
    [ExecutionTime] [time](7) NOT NULL,
    [LastExecutedOn] [datetime] NULL,
    [BatchSize] [int] NOT NULL
)
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Database Configuration

1. Copy `env.example` to `.env`
2. Update the database connection settings:

```env
DB_SERVER=your_sql_server
DB_DATABASE=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true
```

### 3. Run the Application

#### Development Mode

```bash
# Start backend server
npm run dev

# In another terminal, start frontend
npm run client
```

#### Production Mode

```bash
# Build frontend
npm run build

# Start full application
npm start
```

## API Endpoints

- `GET /api/synchronization-tasks` - Get all tasks
- `GET /api/synchronization-tasks/:id` - Get task by ID
- `POST /api/synchronization-tasks` - Create new task
- `PUT /api/synchronization-tasks/:id` - Update task
- `DELETE /api/synchronization-tasks/:id` - Delete task
- `PATCH /api/synchronization-tasks/:id/toggle` - Toggle task enabled status

## Usage

1. **View Tasks**: The main page displays all synchronization tasks in a table
2. **Create Task**: Click "Create New Task" to add a new synchronization task
3. **Edit Task**: Click "Edit" on any task to modify its properties
4. **Enable/Disable**: Use the toggle button to enable or disable tasks
5. **Delete Task**: Click "Delete" to remove a task (with confirmation)

## Task Properties

- **Query**: SQL query to execute
- **Destination Table Name**: Target table for synchronization
- **Frequency**: Daily, Weekly, or Monthly
- **Day Value**: Day of week (1-7) for weekly, or day of month (1-31) for monthly
- **Execution Time**: Time of day to run the task (HH:MM format)
- **Batch Size**: Number of records to process in each batch
- **Enabled**: Whether the task is currently active

## Technologies Used

### Backend
- Node.js with Express
- SQL Server with mssql driver
- Express validation middleware
- CORS and security headers

### Frontend
- React 18 with TypeScript
- Axios for API calls
- Custom CSS for styling
- Responsive design

## Security Features

- Input validation and sanitization
- SQL injection prevention
- Rate limiting
- CORS configuration
- Security headers with Helmet

## Error Handling

- Comprehensive error handling on both frontend and backend
- User-friendly error messages
- Validation feedback
- Network error handling
