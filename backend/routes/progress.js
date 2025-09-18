const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('./users');
const router = express.Router();

// Get user's progress for all algorithms
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        a.title,
        a.slug,
        a.difficulty,
        c.name as category_name
      FROM user_progress p
      JOIN algorithms a ON p.algorithm_id = a.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE p.user_id = $1
      ORDER BY p.updated_at DESC
    `, [req.user.userId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch progress'
    });
  }
});

// Get progress for specific algorithm
router.get('/:algorithmId', authenticateToken, async (req, res) => {
  try {
    const { algorithmId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        p.*,
        a.title,
        a.slug,
        a.difficulty
      FROM user_progress p
      JOIN algorithms a ON p.algorithm_id = a.id
      WHERE p.user_id = $1 AND p.algorithm_id = $2
    `, [req.user.userId, algorithmId]);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: null
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching algorithm progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch progress'
    });
  }
});

// Update progress for an algorithm
router.post('/:algorithmId', authenticateToken, async (req, res) => {
  try {
    const { algorithmId } = req.params;
    const { status, user_solution, notes } = req.body;

    // Validate status
    const validStatuses = ['not_started', 'in_progress', 'completed', 'review'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    // Check if progress record exists
    const existingProgress = await pool.query(
      'SELECT id, attempts FROM user_progress WHERE user_id = $1 AND algorithm_id = $2',
      [req.user.userId, algorithmId]
    );

    let result;
    const now = new Date();

    if (existingProgress.rows.length === 0) {
      // Create new progress record
      result = await pool.query(`
        INSERT INTO user_progress (
          user_id, algorithm_id, status, attempts, last_attempt_at, 
          completed_at, user_solution, notes, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        req.user.userId,
        algorithmId,
        status || 'in_progress',
        1,
        now,
        status === 'completed' ? now : null,
        user_solution || null,
        notes || null,
        now
      ]);
    } else {
      // Update existing progress record
      const currentAttempts = existingProgress.rows[0].attempts;
      
      result = await pool.query(`
        UPDATE user_progress SET
          status = COALESCE($3, status),
          attempts = $4,
          last_attempt_at = $5,
          completed_at = CASE WHEN $3 = 'completed' THEN $6 ELSE completed_at END,
          user_solution = COALESCE($7, user_solution),
          notes = COALESCE($8, notes),
          updated_at = $9
        WHERE user_id = $1 AND algorithm_id = $2
        RETURNING *
      `, [
        req.user.userId,
        algorithmId,
        status,
        currentAttempts + 1,
        now,
        now,
        user_solution,
        notes,
        now
      ]);
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update progress'
    });
  }
});

// Get user's progress statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_attempted,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'review' THEN 1 END) as review
      FROM user_progress 
      WHERE user_id = $1
    `, [req.user.userId]);

    const difficultyResult = await pool.query(`
      SELECT 
        a.difficulty,
        COUNT(*) as attempted,
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed
      FROM user_progress p
      JOIN algorithms a ON p.algorithm_id = a.id
      WHERE p.user_id = $1
      GROUP BY a.difficulty
    `, [req.user.userId]);

    const categoryResult = await pool.query(`
      SELECT 
        c.name as category,
        COUNT(*) as attempted,
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed
      FROM user_progress p
      JOIN algorithms a ON p.algorithm_id = a.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE p.user_id = $1
      GROUP BY c.name
    `, [req.user.userId]);

    res.json({
      success: true,
      data: {
        overview: statsResult.rows[0],
        by_difficulty: difficultyResult.rows,
        by_category: categoryResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching progress stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch progress statistics'
    });
  }
});

module.exports = router;
