import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { progressApi } from '../utils/api';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  CheckCircle, 
  Clock, 
  BarChart3,
  Loader2,
  Trophy,
  Book,
  Brain
} from 'lucide-react';

const Progress = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProgress();
  }, [isAuthenticated, navigate]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const [progressRes, statsRes] = await Promise.all([
        progressApi.getAll(),
        progressApi.getStats()
      ]);

      setProgress(progressRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      setError('Failed to load progress data');
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'review': return 'primary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'review': return Book;
      default: return Target;
    }
  };

  const calculateCompletionRate = () => {
    if (!stats?.overview) return 0;
    const { total_attempted, completed } = stats.overview;
    return total_attempted > 0 ? Math.round((completed / total_attempted) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchProgress} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Progress
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, {user?.username}! Track your algorithm mastery journey.
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.overview.completed}
              </div>
              <div className="text-sm text-gray-600">Problems Solved</div>
            </div>

            <div className="card text-center">
              <div className="flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.overview.total_attempted}
              </div>
              <div className="text-sm text-gray-600">Problems Attempted</div>
            </div>

            <div className="card text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-success-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {calculateCompletionRate()}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>

            <div className="card text-center">
              <div className="flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.overview.in_progress}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress by Difficulty */}
          {stats?.by_difficulty && stats.by_difficulty.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Progress by Difficulty
              </h3>
              <div className="space-y-4">
                {stats.by_difficulty.map((diff) => {
                  const completionRate = diff.attempted > 0 ? Math.round((diff.completed / diff.attempted) * 100) : 0;
                  return (
                    <div key={diff.difficulty}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`badge badge-${getDifficultyColor(diff.difficulty)}`}>
                          {diff.difficulty}
                        </span>
                        <span className="text-sm text-gray-600">
                          {diff.completed}/{diff.attempted}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-${getDifficultyColor(diff.difficulty)}-500 h-2 rounded-full`}
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {completionRate}% complete
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Progress by Category */}
          {stats?.by_category && stats.by_category.length > 0 && (
            <div className="card lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Progress by Category
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.by_category.map((cat) => {
                  const completionRate = cat.attempted > 0 ? Math.round((cat.completed / cat.attempted) * 100) : 0;
                  return (
                    <div key={cat.category} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{cat.category}</h4>
                        <span className="text-sm text-gray-600">
                          {cat.completed}/{cat.attempted}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {completionRate}% complete
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <Link to="/algorithms" className="btn btn-primary">
              Practice More
            </Link>
          </div>

          {progress.length === 0 ? (
            <div className="card text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Progress Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start solving algorithms to track your progress and see your improvement over time.
              </p>
              <Link to="/algorithms" className="btn btn-primary">
                Start Practicing
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {progress.map((item) => {
                const StatusIcon = getStatusIcon(item.status);
                return (
                  <Link
                    key={item.id}
                    to={`/algorithms/${item.slug}`}
                    className="card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <StatusIcon 
                          className={`h-5 w-5 text-${getStatusColor(item.status)}-600`} 
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className={`badge badge-${getDifficultyColor(item.difficulty)}`}>
                              {item.difficulty}
                            </span>
                            <span className="flex items-center space-x-1">
                              <BarChart3 className="h-3 w-3" />
                              <span>{item.category_name}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {item.attempts} attempt{item.attempts !== 1 ? 's' : ''}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`badge badge-${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                        {item.last_attempt_at && (
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(item.last_attempt_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
