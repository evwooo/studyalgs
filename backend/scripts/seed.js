const pool = require('../config/database');

const seedData = async () => {
  try {
    // Clear existing data
    await pool.query('TRUNCATE TABLE test_cases, user_progress, algorithms, categories, users RESTART IDENTITY CASCADE');
    
    // Seed categories
    const categories = [
      { name: 'Array', description: 'Array manipulation and traversal problems' },
      { name: 'String', description: 'String processing and manipulation' },
      { name: 'Linked List', description: 'Linked list operations and algorithms' },
      { name: 'Tree', description: 'Binary trees, BST, and tree traversal' },
      { name: 'Graph', description: 'Graph algorithms and traversal' },
      { name: 'Dynamic Programming', description: 'Optimization problems using DP' },
      { name: 'Sorting', description: 'Sorting algorithms and related problems' },
      { name: 'Searching', description: 'Binary search and search algorithms' },
      { name: 'Stack', description: 'Stack-based problems and algorithms' },
      { name: 'Queue', description: 'Queue and deque based problems' }
    ];

    for (const category of categories) {
      await pool.query(
        'INSERT INTO categories (name, description) VALUES ($1, $2)',
        [category.name, category.description]
      );
    }

    // Seed sample algorithms
    const algorithms = [
      {
        title: 'Two Sum',
        slug: 'two-sum',
        description: 'Find two numbers in an array that add up to a target sum.',
        difficulty: 'Easy',
        category: 'Array',
        problem_statement: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
        example_input: 'nums = [2,7,11,15], target = 9',
        example_output: '[0,1]',
        constraints: `• 2 <= nums.length <= 10^4
• -10^9 <= nums[i] <= 10^9
• -10^9 <= target <= 10^9
• Only one valid answer exists.`,
        time_complexity: 'O(n)',
        space_complexity: 'O(n)',
        solution_template: `function twoSum(nums, target) {
    // Your code here
}`,
        solution_code: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
        explanation: `The naive approach would be to use nested loops to check every pair of numbers, which would take O(n²) time.

Instead, we can use a hash map to store numbers we've seen along with their indices. For each number, we calculate what its complement would need to be (target - current number) and check if we've seen that complement before.

This reduces the time complexity to O(n) with O(n) space complexity.`,
        hints: '["Try using a hash map to store previously seen numbers", "Think about what number you need to find for each current number", "Remember to return the indices, not the values"]',
        tags: '["hash-map", "array", "two-pointers"]'
      },
      {
        title: 'Valid Parentheses',
        slug: 'valid-parentheses',
        description: 'Determine if a string of parentheses is valid.',
        difficulty: 'Easy',
        category: 'Stack',
        problem_statement: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
        example_input: 's = "()[]{}"',
        example_output: 'true',
        constraints: `• 1 <= s.length <= 10^4
• s consists of parentheses only '()[]{}'.`,
        time_complexity: 'O(n)',
        space_complexity: 'O(n)',
        solution_template: `function isValid(s) {
    // Your code here
}`,
        solution_code: `function isValid(s) {
    const stack = [];
    const mapping = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (let char of s) {
        if (char in mapping) {
            if (stack.length === 0 || stack.pop() !== mapping[char]) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }
    
    return stack.length === 0;
}`,
        explanation: `This is a classic stack problem. We iterate through the string:

1. If we encounter an opening bracket, push it onto the stack
2. If we encounter a closing bracket, check if it matches the most recent opening bracket (top of stack)
3. If it matches, pop the stack; if not, the string is invalid
4. After processing all characters, the stack should be empty for a valid string

The stack ensures we handle nested brackets in the correct order (LIFO - Last In, First Out).`,
        hints: '["Consider using a stack data structure", "Map each closing bracket to its corresponding opening bracket", "What should be true about the stack when you finish processing all characters?"]',
        tags: '["stack", "string", "parentheses"]'
      },
      {
        title: 'Maximum Subarray',
        slug: 'maximum-subarray',
        description: 'Find the contiguous subarray with the largest sum.',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        problem_statement: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

A subarray is a contiguous part of an array.`,
        example_input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        example_output: '6',
        constraints: `• 1 <= nums.length <= 10^5
• -10^4 <= nums[i] <= 10^4`,
        time_complexity: 'O(n)',
        space_complexity: 'O(1)',
        solution_template: `function maxSubArray(nums) {
    // Your code here
}`,
        solution_code: `function maxSubArray(nums) {
    let maxSoFar = nums[0];
    let maxEndingHere = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}`,
        explanation: `This problem is solved using Kadane's Algorithm, a dynamic programming approach.

The key insight is that at each position, we decide whether to:
1. Start a new subarray from the current element, or
2. Extend the existing subarray by including the current element

We choose whichever gives us a larger sum. We keep track of:
- maxEndingHere: Maximum sum of subarray ending at current position
- maxSoFar: Maximum sum seen so far (our answer)

This algorithm handles negative numbers elegantly and runs in linear time.`,
        hints: '["Think about whether to start a new subarray or extend the current one at each position", "Consider Kadanes Algorithm", "What should you do when the running sum becomes negative?"]',
        tags: '["dynamic-programming", "array", "kadane-algorithm"]'
      }
    ];

    for (const algo of algorithms) {
      // Get category ID
      const categoryResult = await pool.query(
        'SELECT id FROM categories WHERE name = $1',
        [algo.category]
      );
      const categoryId = categoryResult.rows[0].id;

      // Insert algorithm
      const result = await pool.query(`
        INSERT INTO algorithms (
          title, slug, description, difficulty, category_id, problem_statement,
          example_input, example_output, constraints, time_complexity, space_complexity,
          solution_template, solution_code, explanation, hints, tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING id
      `, [
        algo.title, algo.slug, algo.description, algo.difficulty, categoryId,
        algo.problem_statement, algo.example_input, algo.example_output,
        algo.constraints, algo.time_complexity, algo.space_complexity,
        algo.solution_template, algo.solution_code, algo.explanation,
        algo.hints, algo.tags
      ]);

      console.log(`✅ Added algorithm: ${algo.title}`);
    }

    console.log('🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeding
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('🌱 Database seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedData;
