const pool = require('../config/database');

const createTables = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create algorithm categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create algorithms table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS algorithms (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(200) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        problem_statement TEXT NOT NULL,
        example_input TEXT,
        example_output TEXT,
        constraints TEXT,
        time_complexity VARCHAR(50),
        space_complexity VARCHAR(50),
        solution_template TEXT,
        solution_code TEXT,
        explanation TEXT,
        hints JSONB DEFAULT '[]',
        tags JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user progress table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        algorithm_id INTEGER REFERENCES algorithms(id) ON DELETE CASCADE,
        status VARCHAR(20) CHECK (status IN ('not_started', 'in_progress', 'completed', 'review')) DEFAULT 'not_started',
        attempts INTEGER DEFAULT 0,
        last_attempt_at TIMESTAMP,
        completed_at TIMESTAMP,
        user_solution TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, algorithm_id)
      )
    `);

    // Create test cases table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_cases (
        id SERIAL PRIMARY KEY,
        algorithm_id INTEGER REFERENCES algorithms(id) ON DELETE CASCADE,
        input TEXT NOT NULL,
        expected_output TEXT NOT NULL,
        is_example BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables created successfully!');
    
    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_algorithms_difficulty ON algorithms(difficulty)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_algorithms_category ON algorithms(category_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_user_progress_algorithm ON user_progress(algorithm_id)');
    
    console.log('✅ Database indexes created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

// Run migration
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('🎉 Database migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = createTables;
