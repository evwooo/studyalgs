# StudyAlgs - Algorithm Study Platform

A full-stack web application for studying algorithms and data structures for technical interviews. Built with React frontend, Node.js/Express backend, and PostgreSQL database.

## Features

- 🧠 **Interactive Algorithm Practice** - Code editor with syntax highlighting and snippets
- 📊 **Progress Tracking** - Monitor your learning journey with detailed statistics
- 🔍 **Smart Filtering** - Filter algorithms by difficulty, category, and search terms
- 💾 **Solution Persistence** - Save your code solutions and track attempts
- 🎯 **Interview-Focused** - Curated problems commonly seen in technical interviews
- 📝 **Detailed Explanations** - Learn from comprehensive problem breakdowns
- 💡 **Hints System** - Get progressive hints when you're stuck
- 👤 **User Authentication** - Secure user accounts with JWT tokens

## Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Monaco Editor** - VS Code-powered code editor
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd studyalgs
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb studyalgs
   
   # Or using psql
   psql -c "CREATE DATABASE studyalgs;"
   ```

4. **Configure environment variables**
   ```bash
   # Copy environment template
   cp backend/env.example backend/.env
   
   # Edit backend/.env with your database credentials
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=studyalgs
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key_here
   ```

5. **Run database migrations**
   ```bash
   cd backend
   npm run db:migrate
   ```

6. **Seed the database with sample algorithms**
   ```bash
   npm run db:seed
   ```

7. **Start the development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   cd backend && PORT=5001 npm run dev
   
   # Terminal 2 - Frontend  
   cd frontend && npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5001`
   - Frontend server on `http://localhost:3000`

## Project Structure

```
studyalgs/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── routes/
│   │   ├── algorithms.js        # Algorithm API routes
│   │   ├── users.js            # User auth routes
│   │   └── progress.js         # Progress tracking routes
│   ├── scripts/
│   │   ├── migrate.js          # Database migration
│   │   └── seed.js             # Sample data seeding
│   ├── server.js               # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx      # Main layout component
│   │   │   ├── Header.jsx      # Navigation header
│   │   │   ├── Footer.jsx      # Site footer
│   │   │   └── CodeEditor.jsx  # Monaco code editor
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── AlgorithmList.jsx # Algorithm browsing
│   │   │   ├── AlgorithmDetail.jsx # Individual algorithm
│   │   │   ├── Progress.jsx    # User progress dashboard
│   │   │   ├── Login.jsx       # User login
│   │   │   ├── Register.jsx    # User registration
│   │   │   └── NotFound.jsx    # 404 page
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── utils/
│   │   │   └── api.js          # API client utilities
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # React entry point
│   ├── index.html
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── vite.config.js          # Vite configuration
│   └── package.json
└── package.json                # Root package.json
```

## Database Schema

### Core Tables

- **users** - User accounts with authentication
- **categories** - Algorithm categories (Array, Tree, Graph, etc.)
- **algorithms** - Algorithm problems with solutions and explanations
- **user_progress** - Individual user progress on algorithms
- **test_cases** - Input/output test cases for algorithms

## API Endpoints

### Algorithms
- `GET /api/algorithms` - List algorithms with filtering
- `GET /api/algorithms/:slug` - Get algorithm details
- `GET /api/algorithms/meta/categories` - Get all categories
- `GET /api/algorithms/meta/difficulties` - Get difficulty stats

### Users
- `POST /api/users/register` - Create new user account
- `POST /api/users/login` - Authenticate user
- `GET /api/users/profile` - Get current user profile

### Progress
- `GET /api/progress` - Get user's progress on all algorithms
- `GET /api/progress/:algorithmId` - Get progress for specific algorithm
- `POST /api/progress/:algorithmId` - Update progress for algorithm
- `GET /api/progress/stats/overview` - Get user's progress statistics

## Development Commands

```bash
# Install all dependencies
npm run install:all

# Start both servers in development
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend

# Database operations
cd backend
npm run db:migrate    # Run migrations
npm run db:seed      # Seed sample data

# Frontend build
cd frontend
npm run build        # Build for production
npm run preview      # Preview production build
```

## Features in Detail

### Algorithm Practice
- Interactive code editor with JavaScript syntax highlighting
- Built-in code snippets for common patterns (loops, two-pointers, binary search, etc.)
- Progressive hints system to guide learning
- Solution viewing with detailed explanations

### Progress Tracking
- Track completion status for each algorithm
- Monitor attempts and save solutions
- View progress statistics by difficulty and category
- Personal dashboard with learning analytics

### User Experience
- Responsive design for desktop and mobile
- Clean, modern interface with Tailwind CSS
- Fast loading with Vite development server
- Intuitive navigation and filtering

## Troubleshooting

### Algorithm Clicking Not Working

If clicking on algorithms doesn't navigate to the detail page:

1. **Check Browser Console** (F12 → Console tab):
   - Look for JavaScript errors
   - Common issues: React Router errors, API connection failures

2. **Verify Servers Are Running**:
   ```bash
   # Check backend
   curl http://localhost:5001/api/health
   
   # Check frontend
   curl http://localhost:3000
   ```

3. **Test Direct Navigation**:
   - Try visiting `http://localhost:3000/algorithms/two-sum` directly
   - Should show the algorithm detail page

4. **Test API Endpoints**:
   ```bash
   # Test algorithms list
   curl http://localhost:3000/api/algorithms
   
   # Test specific algorithm
   curl http://localhost:3000/api/algorithms/two-sum
   ```

5. **Check Network Tab** (F12 → Network tab):
   - Look for failed API requests when clicking
   - Verify requests go to the correct backend port (5001)

### Common Port Issues

If you see "Failed to load algorithms":
- Make sure backend is on port 5001: `lsof -i :5001`
- Make sure frontend is on port 3000: `lsof -i :3000`
- Check `.env` file in backend directory exists

### PostgreSQL Database Management

```bash
# Start PostgreSQL service
brew services start postgresql

# Stop PostgreSQL service
brew services stop postgresql

# Restart PostgreSQL service
brew services restart postgresql

# Check PostgreSQL status
brew services list | grep postgresql
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open a GitHub issue or contact the development team.
