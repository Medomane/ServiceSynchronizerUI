const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 60000,
  requestTimeout: 60000
};

class Database {
  constructor() {
    this.pool = null;
    this.connected = false;
  }

  async connect() {
    try {
      if (!this.connected) {
        this.pool = await sql.connect(config);
        this.connected = true;
        console.log('Connected to SQL Server database');
      }
      return this.pool;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.connected) {
        await sql.close();
        this.connected = false;
        console.log('Disconnected from SQL Server database');
      }
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    }
  }

  getPool() {
    if (!this.connected || !this.pool) {
      throw new Error('Database not connected');
    }
    return this.pool;
  }
}

const database = new Database();

module.exports = {
  database,
  sql
};
