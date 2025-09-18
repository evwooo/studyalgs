const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// Get all algorithms with optional filtering
router.get('/', async (req, res) => {
  try {
    const { difficulty, category, search } = req.query;
    
    let query = `
      SELECT a.*, c.name as category_name 
      FROM algorithms a 
      LEFT JOIN categories c ON a.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (difficulty) {
      paramCount++;
      query += ` AND a.difficulty = $${paramCount}`;
      params.push(difficulty);
    }

    if (category) {
      paramCount++;
      query += ` AND c.name = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND (a.title ILIKE $${paramCount} OR a.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY a.created_at DESC`;

    const result = await pool.query(query, params);
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching algorithms:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch algorithms' 
    });
  }
});

// Get algorithm by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await pool.query(`
      SELECT a.*, c.name as category_name 
      FROM algorithms a 
      LEFT JOIN categories c ON a.category_id = c.id 
      WHERE a.slug = $1
    `, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Algorithm not found' 
      });
    }

    // Get test cases for this algorithm
    const testCasesResult = await pool.query(
      'SELECT * FROM test_cases WHERE algorithm_id = $1 ORDER BY id',
      [result.rows[0].id]
    );

    const algorithm = {
      ...result.rows[0],
      test_cases: testCasesResult.rows
    };

    res.json({
      success: true,
      data: algorithm
    });
  } catch (error) {
    console.error('Error fetching algorithm:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch algorithm' 
    });
  }
});

// Get all categories
router.get('/meta/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch categories' 
    });
  }
});

// Get difficulty levels with counts
router.get('/meta/difficulties', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT difficulty, COUNT(*) as count 
      FROM algorithms 
      GROUP BY difficulty 
      ORDER BY 
        CASE difficulty 
          WHEN 'Easy' THEN 1 
          WHEN 'Medium' THEN 2 
          WHEN 'Hard' THEN 3 
        END
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching difficulties:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch difficulties' 
    });
  }
});

module.exports = router;
