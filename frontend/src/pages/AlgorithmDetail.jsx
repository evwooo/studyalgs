import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { algorithmApi, progressApi } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import CodeEditor from '../components/CodeEditor';
import { 
  ArrowLeft, 
  Clock, 
  BarChart3, 
  Lightbulb, 
  CheckCircle, 
  Play,
  Save,
  RotateCcw,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';

const AlgorithmDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [algorithm, setAlgorithm] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAlgorithmData();
  }, [slug]);

  const fetchAlgorithmData = async () => {
    try {
      setLoading(true);
      const algorithmRes = await algorithmApi.getBySlug(slug);
      const algorithmData = algorithmRes.data.data;
      setAlgorithm(algorithmData);
      
      if (isAuthenticated && algorithmData) {
        try {
          const progress = await progressApi.getByAlgorithm(algorithmData.id);
          setUserProgress(progress.data.data);
          setUserCode(progress.data.data?.user_solution || algorithmData.solution_template || '');
        } catch (err) {
          // No progress found, use template
          setUserCode(algorithmData.solution_template || '');
        }
      } else {
        setUserCode(algorithmData.solution_template || '');
      }
    } catch (err) {
      setError('Failed to load algorithm');
      console.error('Error fetching algorithm:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProgress = async () => {
    if (!isAuthenticated || !algorithm) return;
    
    try {
      setSaving(true);
      await progressApi.update(algorithm.id, {
        status: 'in_progress',
        user_solution: userCode
      });
      
      // Refresh progress
      const progress = await progressApi.getByAlgorithm(algorithm.id);
      setUserProgress(progress.data.data);
    } catch (err) {
      console.error('Error saving progress:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!isAuthenticated || !algorithm) return;
    
    try {
      await progressApi.update(algorithm.id, {
        status: 'completed',
        user_solution: userCode
      });
      
      // Refresh progress
      const progress = await progressApi.getByAlgorithm(algorithm.id);
      setUserProgress(progress.data.data);
    } catch (err) {
      console.error('Error marking as completed:', err);
    }
  };

  const resetToTemplate = () => {
    setUserCode(algorithm?.solution_template || '');
    setShowSolution(false);
  };

  const showNextHint = () => {
    if (algorithm?.hints && currentHintIndex < algorithm.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading algorithm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => navigate('/algorithms')} className="btn btn-primary">
            Back to Algorithms
          </button>
        </div>
      </div>
    );
  }

  if (!algorithm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Algorithm not found</p>
          <button onClick={() => navigate('/algorithms')} className="btn btn-primary">
            Back to Algorithms
          </button>
        </div>
      </div>
    );
  }

  const hints = algorithm.hints || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/algorithms')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Algorithms</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {algorithm.title}
                </h1>
                <span className={`badge badge-${getDifficultyColor(algorithm.difficulty)}`}>
                  {algorithm.difficulty}
                </span>
                {userProgress && (
                  <span className={`badge badge-${getStatusColor(userProgress.status)}`}>
                    {userProgress.status.replace('_', ' ')}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>{algorithm.category_name}</span>
                </div>
                
                {algorithm.time_complexity && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Time: {algorithm.time_complexity}</span>
                  </div>
                )}
                
                {algorithm.space_complexity && (
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>Space: {algorithm.space_complexity}</span>
                  </div>
                )}
              </div>
            </div>

            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveProgress}
                  disabled={saving}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save</span>
                </button>
                
                <button
                  onClick={handleMarkCompleted}
                  className="btn btn-success flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Problem Statement</h2>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line text-gray-700">{algorithm.problem_statement}</p>
              </div>
            </div>

            {algorithm.example_input && algorithm.example_output && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Example</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Input:</div>
                    <div className="bg-gray-100 rounded p-3 font-mono text-sm">
                      {algorithm.example_input}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Output:</div>
                    <div className="bg-gray-100 rounded p-3 font-mono text-sm">
                      {algorithm.example_output}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {algorithm.constraints && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Constraints</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-line text-gray-700">{algorithm.constraints}</p>
                </div>
              </div>
            )}

            {/* Hints Section */}
            {hints.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <span>Hints</span>
                  </h3>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="btn btn-secondary text-sm"
                  >
                    {showHints ? 'Hide Hints' : 'Show Hints'}
                  </button>
                </div>
                
                {showHints && (
                  <div className="space-y-3">
                    {hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <div className="text-sm font-medium text-yellow-800 mb-1">
                          Hint {index + 1}:
                        </div>
                        <div className="text-sm text-yellow-700">{hint}</div>
                      </div>
                    ))}
                    
                    {currentHintIndex < hints.length - 1 && (
                      <button
                        onClick={showNextHint}
                        className="btn btn-secondary text-sm"
                      >
                        Show Next Hint
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Solution Section */}
            {algorithm.explanation && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Solution & Explanation</h3>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="btn btn-secondary text-sm flex items-center space-x-2"
                  >
                    {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span>{showSolution ? 'Hide' : 'Show'} Solution</span>
                  </button>
                </div>
                
                {showSolution && (
                  <div className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-line text-gray-700">{algorithm.explanation}</p>
                    </div>
                    
                    {algorithm.solution_code && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Optimal Solution:</div>
                        <CodeEditor
                          value={algorithm.solution_code}
                          readOnly={true}
                          height="300px"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Code Editor</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetToTemplate}
                    className="btn btn-secondary text-sm flex items-center space-x-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                  <button className="btn btn-primary text-sm flex items-center space-x-2">
                    <Play className="h-4 w-4" />
                    <span>Run</span>
                  </button>
                </div>
              </div>
              
              <CodeEditor
                value={userCode}
                onChange={setUserCode}
                height="500px"
              />
            </div>

            {!isAuthenticated && (
              <div className="card bg-blue-50 border-blue-200">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Save Your Progress
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Sign up to save your solutions and track your progress across all algorithms.
                  </p>
                  <button
                    onClick={() => navigate('/register')}
                    className="btn btn-primary"
                  >
                    Create Free Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmDetail;
