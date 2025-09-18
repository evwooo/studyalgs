# StudyAlgs

Hey there! This is my algorithm study platform that I built to help myself (and hopefully others) prep for technical interviews. I got tired of jumping between different coding platforms, so I decided to build my own with all the features I actually wanted.

## What It Does

Basically, it's a place where you can:

-  **Practice algorithms** with a built-in code editor (it's actually pretty nice!)
-  **Track your progress** so you can see how much you've improved
-  **Filter problems** by difficulty or topic when you want to focus on specific areas
-  **Save your solutions** so you don't lose your work
-  **Focus on interview prep** - I curated problems that actually show up in real interviews
-  **Learn from explanations** - detailed breakdowns of how to solve each problem
-  **Get hints** when you're stuck (we've all been there)
-  **Create an account** to keep track of everything

## How I Built It

I wanted to learn full-stack development, so I picked technologies that are actually used in the industry:

### Frontend
- **React 18** - because it's everywhere and I needed to learn it
- **Vite** - way faster than Create React App for development
- **Tailwind CSS** - makes styling so much easier than writing custom CSS
- **React Router** - for navigation between pages
- **Monaco Editor** - the same editor that powers VS Code!
- **Axios** - for making API calls to the backend
- **Lucide React** - clean icons that don't look like they're from 2010

### Backend
- **Node.js** - JavaScript everywhere = less context switching
- **Express.js** - simple and straightforward web framework
- **PostgreSQL** - real database that can handle actual data
- **bcryptjs** - for secure password hashing (don't roll your own crypto!)
- **jsonwebtoken** - JWT tokens for user authentication
- **express-validator** - input validation because trust no one

## Set Up

### What You'll Need

- Node.js (v18+) - if you don't have this, grab it from nodejs.org
- PostgreSQL (v13+) - I recommend installing via Homebrew on Mac
- npm (comes with Node.js)

### Setup Steps

1. **Clone this repo**
   ```bash
   git clone <repository-url>
   cd studyalgs
   ```

2. **Install all the dependencies**
   ```bash
   npm run install:all
   ```
   (This installs dependencies for both frontend and backend)

3. **Set up your database**
   ```bash
   # Create the database
   createdb studyalgs
   ```

4. **Configure your environment**
   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env
   ```
   
   Then edit `backend/.env` with your database info:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=studyalgs
   DB_USER=your_username
   DB_PASSWORD=your_password (or leave empty if no password)
   JWT_SECRET=make_this_something_random
   ```

5. **Set up the database tables**
   ```bash
   cd backend
   npm run db:migrate
   ```

6. **Add some sample algorithms**
   ```bash
   npm run db:seed
   ```

7. **Fire it up!**
   ```bash
   # From the root directory
   npm run dev
   ```

   Or if you want to run them separately:
   ```bash
   # Terminal 1 - Backend
   cd backend && PORT=5001 npm run dev
   
   # Terminal 2 - Frontend  
   cd frontend && npm run dev
   ```

   You should see:
   - Backend running on `http://localhost:5001`
   - Frontend running on `http://localhost:3000`

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

## Cool Features I'm Proud Of

### The Code Editor
- I integrated Monaco Editor (the same one VS Code uses!) with JavaScript syntax highlighting
- Added code snippets for common algorithm patterns - saves so much typing
- Progressive hints system that doesn't just give away the answer
- You can view solutions with detailed explanations once you're done struggling

### Progress Tracking
- Tracks everything: which problems you've solved, how many attempts, when you solved them
- Shows stats by difficulty and topic so you can see where you need work
- Personal dashboard that actually makes you feel good about your progress
- Saves your solutions so you can come back and review your old code

### User Experience Stuff
- Works on mobile and desktop
- Clean interface with Tailwind CSS - no more fighting with custom CSS
- Super fast loading thanks to Vite
- Easy filtering and search so you can find exactly what you want to practice

## Troubleshooting

### If algorithm pages aren't loading

This happened to me a few times while building this:

1. **Check the browser console** (F12 → Console):
   - Look for red error messages
   - Usually it's either a React Router issue or the API isn't responding

2. **Make sure both servers are actually running**:
   ```bash
   # Check if backend is alive
   curl http://localhost:5001/api/health
   
   # Check if frontend is serving
   curl http://localhost:3000
   ```

3. **Try navigating directly**:
   - Go to `http://localhost:3000/algorithms/two-sum` in your browser
   - If this works but clicking doesn't, it's a frontend routing issue

4. **Test the API**:
   ```bash
   # See if you can get the algorithms list
   curl http://localhost:3000/api/algorithms
   
   # Test a specific algorithm
   curl http://localhost:3000/api/algorithms/two-sum
   ```

### Common issues I ran into

**"Failed to load algorithms"** usually means:
- Backend isn't running on port 5001: `lsof -i :5001`
- Frontend isn't running on port 3000: `lsof -i :3000` 
- The `.env` file is missing in the backend directory

**Database connection issues**:
```bash
# Start PostgreSQL (if you're on Mac with Homebrew)
brew services start postgresql

# Stop it when you're done
brew services stop postgresql

# Check if it's running
brew services list | grep postgresql
```

## Want to Contribute?

If you find bugs or want to add features, feel free to:

1. Fork this repo
2. Create a branch for your feature
3. Make your changes
4. Test everything works
5. Submit a pull request

I'm always open to suggestions and improvements!

## License

MIT License - basically, do whatever you want with this code.

## Questions?

If something's not working or you have ideas for improvements, just open an issue on GitHub. I try to respond pretty quickly!
