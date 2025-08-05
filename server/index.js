const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const path = require('path');
require('dotenv').config();

const { db, initializeDatabase, createDefaultUser } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'hr-tracker-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
});

// Profile routes
app.get('/api/profiles', authenticateToken, (req, res) => {
  const { status, stage, search } = req.query;
  
  let query = `
    SELECT p.*, u.username as created_by_name,
           COUNT(e.id) as evaluation_count,
           MAX(e.interview_date) as last_interview_date
    FROM profiles p
    LEFT JOIN users u ON p.created_by = u.id
    LEFT JOIN evaluations e ON p.id = e.profile_id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (status) {
    query += ' AND p.status = ?';
    params.push(status);
  }
  
  if (stage) {
    query += ' AND p.current_stage = ?';
    params.push(stage);
  }
  
  if (search) {
    query += ' AND (p.name LIKE ? OR p.email LIKE ? OR p.position_applied LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }
  
  query += ' GROUP BY p.id ORDER BY p.created_at DESC';
  
  db.all(query, params, (err, profiles) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(profiles);
  });
});

app.get('/api/profiles/:id', authenticateToken, (req, res) => {
  const profileId = req.params.id;
  
  db.get(`
    SELECT p.*, u.username as created_by_name
    FROM profiles p
    LEFT JOIN users u ON p.created_by = u.id
    WHERE p.id = ?
  `, [profileId], (err, profile) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Get evaluations for this profile
    db.all('SELECT * FROM evaluations WHERE profile_id = ? ORDER BY created_at DESC', [profileId], (err, evaluations) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Get status history
      db.all(`
        SELECT sh.*, u.username as changed_by_name
        FROM status_history sh
        LEFT JOIN users u ON sh.changed_by = u.id
        WHERE sh.profile_id = ?
        ORDER BY sh.created_at DESC
      `, [profileId], (err, history) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
          ...profile,
          evaluations,
          history
        });
      });
    });
  });
});

app.post('/api/profiles', authenticateToken, [
  body('name').notEmpty().withMessage('Name is required'),
  body('position_applied').notEmpty().withMessage('Position applied is required'),
  body('technology_stack').notEmpty().withMessage('Technology stack is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    email,
    phone,
    experience_years,
    current_company,
    position_applied,
    technology_stack,
    resume_path
  } = req.body;

  db.run(`
    INSERT INTO profiles (
      name, email, phone, experience_years, current_company,
      position_applied, technology_stack, resume_path, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    name, email, phone, experience_years, current_company,
    position_applied, technology_stack, resume_path, req.user.id
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Log the creation in status history
    db.run(`
      INSERT INTO status_history (
        profile_id, new_status, new_stage, changed_by, reason
      ) VALUES (?, ?, ?, ?, ?)
    `, [this.lastID, 'new', 'initial', req.user.id, 'Profile created'], (err) => {
      if (err) {
        console.error('Error logging status history:', err);
      }
    });
    
    res.status(201).json({ 
      id: this.lastID,
      message: 'Profile created successfully' 
    });
  });
});

app.put('/api/profiles/:id/status', authenticateToken, [
  body('status').notEmpty().withMessage('Status is required'),
  body('stage').notEmpty().withMessage('Stage is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const profileId = req.params.id;
  const { status, stage, reason } = req.body;

  // First, get current status and stage
  db.get('SELECT status, current_stage FROM profiles WHERE id = ?', [profileId], (err, currentProfile) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!currentProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Update profile
    db.run(`
      UPDATE profiles 
      SET status = ?, current_stage = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, stage, profileId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Log status change
      db.run(`
        INSERT INTO status_history (
          profile_id, previous_status, new_status, previous_stage, 
          new_stage, changed_by, reason
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        profileId, currentProfile.status, status, 
        currentProfile.current_stage, stage, req.user.id, reason
      ], (err) => {
        if (err) {
          console.error('Error logging status history:', err);
        }
      });

      res.json({ message: 'Profile status updated successfully' });
    });
  });
});

// Evaluation routes
app.post('/api/profiles/:id/evaluations', authenticateToken, [
  body('evaluation_type').notEmpty().withMessage('Evaluation type is required'),
  body('evaluator_name').notEmpty().withMessage('Evaluator name is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const profileId = req.params.id;
  const {
    evaluation_type,
    evaluator_name,
    panel_names,
    interview_date,
    scheduled_date,
    status,
    technical_score,
    communication_score,
    overall_score,
    feedback,
    recommendation,
    next_round_scheduled
  } = req.body;

  db.run(`
    INSERT INTO evaluations (
      profile_id, evaluation_type, evaluator_name, panel_names,
      interview_date, scheduled_date, status, technical_score,
      communication_score, overall_score, feedback, recommendation,
      next_round_scheduled
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    profileId, evaluation_type, evaluator_name, panel_names,
    interview_date, scheduled_date, status || 'scheduled', technical_score,
    communication_score, overall_score, feedback, recommendation,
    next_round_scheduled
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.status(201).json({ 
      id: this.lastID,
      message: 'Evaluation added successfully' 
    });
  });
});

app.put('/api/evaluations/:id', authenticateToken, (req, res) => {
  const evaluationId = req.params.id;
  const {
    status,
    technical_score,
    communication_score,
    overall_score,
    feedback,
    recommendation,
    next_round_scheduled
  } = req.body;

  db.run(`
    UPDATE evaluations 
    SET status = ?, technical_score = ?, communication_score = ?,
        overall_score = ?, feedback = ?, recommendation = ?,
        next_round_scheduled = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    status, technical_score, communication_score, overall_score,
    feedback, recommendation, next_round_scheduled, evaluationId
  ], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ message: 'Evaluation updated successfully' });
  });
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const stats = {};
  
  // Get profile counts by status
  db.all(`
    SELECT status, COUNT(*) as count
    FROM profiles
    GROUP BY status
  `, (err, statusCounts) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    stats.statusCounts = statusCounts.reduce((acc, item) => {
      acc[item.status] = item.count;
      return acc;
    }, {});
    
    // Get recent profiles
    db.all(`
      SELECT p.*, u.username as created_by_name
      FROM profiles p
      LEFT JOIN users u ON p.created_by = u.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `, (err, recentProfiles) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      stats.recentProfiles = recentProfiles;
      
      // Get upcoming interviews
      db.all(`
        SELECT e.*, p.name as candidate_name, p.position_applied
        FROM evaluations e
        JOIN profiles p ON e.profile_id = p.id
        WHERE e.scheduled_date > datetime('now')
        ORDER BY e.scheduled_date ASC
        LIMIT 5
      `, (err, upcomingInterviews) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        stats.upcomingInterviews = upcomingInterviews;
        res.json(stats);
      });
    });
  });
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    createDefaultUser();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Database initialized successfully`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();