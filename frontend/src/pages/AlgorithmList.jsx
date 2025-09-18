import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { algorithmApi } from '../utils/api';
import { 
  Search, 
  Filter, 
  Clock, 
  BarChart3,
  ChevronRight,
  Loader2
} from 'lucide-react';

const AlgorithmList = () => {
  const [algorithms, setAlgorithms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);

  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [algorithmsRes, categoriesRes] = await Promise.all([
        algorithmApi.getAll({
          search: searchParams.get('search') || undefined,
          difficulty: searchParams.get('difficulty') || undefined,
          category: searchParams.get('category') || undefined,
        }),
        algorithmApi.getCategories()
      ]);

      setAlgorithms(algorithmsRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (err) {
      setError('Failed to load algorithms');
      console.error('Error fetching algorithms:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (filters) => {
    const newParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });
    
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({
      search: searchTerm,
      difficulty: selectedDifficulty,
      category: selectedCategory,
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('');
    setSelectedCategory('');
    setSearchParams(new URLSearchParams());
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading algorithms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="btn btn-primary"
          >
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Algorithm Practice
          </h1>
          <p className="text-lg text-gray-600">
            Master data structures and algorithms with our curated collection of interview problems.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search algorithms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {algorithms.length} algorithm{algorithms.length !== 1 ? 's' : ''}
                </span>
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="input"
                  >
                    <option value="">All Difficulties</option>
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="btn btn-secondary text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Algorithm List */}
        {algorithms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No algorithms found matching your criteria.</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {algorithms.map((algorithm) => (
              <Link
                key={algorithm.id}
                to={`/algorithms/${algorithm.slug}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {algorithm.title}
                      </h3>
                      <span className={`badge badge-${getDifficultyColor(algorithm.difficulty)}`}>
                        {algorithm.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {algorithm.description}
                    </p>

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
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors ml-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmList;
