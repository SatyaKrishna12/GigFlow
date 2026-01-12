import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineSearch, AiOutlineLoading3Quarters, AiOutlineClose, AiOutlineInbox } from 'react-icons/ai';
import api from '../services/api';
import GigCard from '../components/GigCard';

const Gigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Fetch gigs from API
  useEffect(() => {
    fetchGigs();
  }, [searchParams]);

  const fetchGigs = async () => {
    setLoading(true);
    setError('');

    try {
      const search = searchParams.get('search') || '';
      const response = await api.get(`/gigs${search ? `?search=${search}` : ''}`);
      setGigs(response.data.gigs || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-[#1dbf73] to-[#19a463] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Find Your Next Gig
          </h1>
          <p className="text-xl text-center mb-8 text-green-50">
            Browse opportunities from talented clients worldwide
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-4 top-4 text-gray-500">
                  <AiOutlineSearch className="h-6 w-6" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gigs by title..."
                  className="w-full pl-14 pr-4 py-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none text-lg shadow-md"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-white text-[#1dbf73] rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
              >
                Search
              </button>
              {searchParams.get('search') && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-6 py-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-md"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Gigs List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {searchParams.get('search') ? (
              <>
                Search results for "{searchParams.get('search')}"
                <span className="text-[#1dbf73] ml-2">({gigs.length})</span>
              </>
            ) : (
              <>
                Available Gigs
                <span className="text-[#1dbf73] ml-2">({gigs.length})</span>
              </>
            )}
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <AiOutlineLoading3Quarters className="animate-spin h-12 w-12 text-[#1dbf73]" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center justify-center">
            <AiOutlineClose className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && gigs.length === 0 && (
          <div className="text-center py-20">
            <AiOutlineInbox className="h-24 w-24 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No gigs found</h3>
            <p className="text-gray-500">
              {searchParams.get('search')
                ? 'Try adjusting your search query'
                : 'Check back later for new opportunities'}
            </p>
          </div>
        )}

        {/* Gigs Grid */}
        {!loading && !error && gigs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gigs;
