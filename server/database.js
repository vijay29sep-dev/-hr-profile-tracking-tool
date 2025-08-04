const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'hr_tracker.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table (HR team members)
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'hr',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Profiles table
      db.run(`
        CREATE TABLE IF NOT EXISTS profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          experience_years INTEGER,
          current_company TEXT,
          position_applied TEXT NOT NULL,
          resume_path TEXT,
          technology_stack TEXT,
          status TEXT DEFAULT 'new',
          current_stage TEXT DEFAULT 'initial',
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `);

      // Evaluations table
      db.run(`
        CREATE TABLE IF NOT EXISTS evaluations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          profile_id INTEGER NOT NULL,
          evaluation_type TEXT NOT NULL,
          evaluator_name TEXT,
          panel_names TEXT,
          interview_date DATETIME,
          scheduled_date DATETIME,
          status TEXT DEFAULT 'scheduled',
          technical_score INTEGER,
          communication_score INTEGER,
          overall_score INTEGER,
          feedback TEXT,
          recommendation TEXT,
          next_round_scheduled DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE
        )
      `);

      // Status history table
      db.run(`
        CREATE TABLE IF NOT EXISTS status_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          profile_id INTEGER NOT NULL,
          previous_status TEXT,
          new_status TEXT NOT NULL,
          previous_stage TEXT,
          new_stage TEXT NOT NULL,
          changed_by INTEGER,
          reason TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE,
          FOREIGN KEY (changed_by) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating tables:', err);
          reject(err);
        } else {
          console.log('Database tables created successfully');
          resolve();
        }
      });
    });
  });
};

// Create default admin user
const createDefaultUser = () => {
  const bcrypt = require('bcryptjs');
  const defaultPassword = bcrypt.hashSync('admin123', 10);
  
  db.run(`
    INSERT OR IGNORE INTO users (username, email, password, role)
    VALUES (?, ?, ?, ?)
  `, ['admin', 'admin@company.com', defaultPassword, 'admin'], (err) => {
    if (err) {
      console.error('Error creating default user:', err);
    } else {
      console.log('Default admin user created (username: admin, password: admin123)');
    }
  });
};

module.exports = {
  db,
  initializeDatabase,
  createDefaultUser
};