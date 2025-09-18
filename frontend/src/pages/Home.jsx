import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Code, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  ArrowRight,
  BookOpen,
  Clock,
  Users
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Code,
      title: 'Interactive Coding Practice',
      description: 'Practice algorithms with a built-in code editor and instant feedback.'
    },
    {
      icon: TrendingUp,
      title: 'Track Your Progress',
      description: 'Monitor your learning journey with detailed progress tracking and statistics.'
    },
    {
      icon: Target,
      title: 'Interview-Focused',
      description: 'Curated problems that commonly appear in technical interviews.'
    },
    {
      icon: CheckCircle,
      title: 'Detailed Solutions',
      description: 'Learn from comprehensive explanations and optimal solutions.'
    }
  ];

  const stats = [
    { icon: BookOpen, label: 'Algorithms', value: '100+' },
    { icon: Users, label: 'Students', value: '10K+' },
    { icon: Clock, label: 'Hours Saved', value: '50K+' },
  ];

  const difficulties = [
    { 
      level: 'Easy', 
      description: 'Perfect for beginners to build confidence',
      color: 'success',
      count: '40+'
    },
    { 
      level: 'Medium', 
      description: 'Intermediate challenges for skill development',
      color: 'warning',
      count: '50+'
    },
    { 
      level: 'Hard', 
      description: 'Advanced problems for interview preparation',
      color: 'danger',
      count: '25+'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Algorithms for
              <span className="block text-primary-200">Technical Interviews</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Build your coding confidence with curated algorithm problems, interactive practice, 
              and detailed explanations designed for interview success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/algorithms"
                className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
              >
                Start Practicing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3"
                >
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines the best practices from top tech companies 
              to help you ace your technical interviews.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card text-center">
                  <Icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Difficulty Levels Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Progress at Your Own Pace
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from three difficulty levels designed to build your skills progressively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {difficulties.map((diff, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                <div className={`badge badge-${diff.color} text-lg px-4 py-2 mb-4`}>
                  {diff.level}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {diff.count} Problems
                </div>
                <p className="text-gray-600 mb-6">
                  {diff.description}
                </p>
                <Link
                  to={`/algorithms?difficulty=${diff.level}`}
                  className="btn btn-secondary w-full"
                >
                  Start {diff.level}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have improved their coding skills 
            and landed their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/algorithms"
              className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Browse Algorithms
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
