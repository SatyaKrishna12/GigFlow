import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters, AiOutlineClose, AiOutlineDollar, AiOutlineClockCircle, AiOutlineCalendar, AiOutlineUser, AiOutlineCheckCircle } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import BidForm from '../components/BidForm';

const GigDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hiringBidId, setHiringBidId] = useState(null);

  useEffect(() => {
    fetchGigDetails();
  }, [id]);

  const fetchGigDetails = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch gig details
      const gigResponse = await api.get(`/gigs/${id}`);
      const gigData = gigResponse.data.gig;
      setGig(gigData);

      // If authenticated and user is the owner, fetch bids
      if (isAuthenticated && user && gigData.owner._id === user._id) {
        const bidsResponse = await api.get(`/gigs/${id}/bids`);
        setBids(bidsResponse.data.bids || []);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmitted = () => {
    // Refresh gig details after submitting a bid
    fetchGigDetails();
  };

  const handleHire = async (bidId) => {
    if (!window.confirm('Are you sure you want to hire this freelancer?')) {
      return;
    }

    setHiringBidId(bidId);

    try {
      // Update the local state immediately for better UX (optimistic update)
      // Update gig status
      setGig(prev => ({ ...prev, status: 'assigned' }));
      
      // Update bids status
      setBids(prevBids => 
        prevBids.map(bid => ({
          ...bid,
          status: bid._id === bidId ? 'hired' : 'rejected'
        }))
      );
      
      const response = await api.patch(`/bids/${bidId}/hire`);
      
      toast.success('Freelancer hired successfully!');
      
      // Refresh to ensure data is in sync with backend
      await fetchGigDetails();
    } catch (err) {
      toast.error(err.message);
      // Revert any optimistic updates by refetching
      fetchGigDetails();
    } finally {
      setHiringBidId(null);
    }
  };

  // Check if current user is the owner
  const isOwner = isAuthenticated && gig?.owner._id === user?._id;

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <AiOutlineLoading3Quarters className="animate-spin h-12 w-12 text-[#1dbf73]" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
        <div className="max-w-md w-full p-6 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <div className="flex items-center mb-2">
            <AiOutlineClose className="h-6 w-6 mr-2" />
            <span className="font-semibold">Error</span>
          </div>
          <p>{error}</p>
          <button
            onClick={() => navigate('/gigs')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Gigs
          </button>
        </div>
      </div>
    );
  }

  if (!gig) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/gigs')}
          className="mb-6 flex items-center text-gray-600 hover:text-[#1dbf73] transition-colors"
        >
          <AiOutlineClose className="h-5 w-5 mr-1" />
          Back to Gigs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Gig Details Card */}
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{gig.title}</h1>

              {/* Owner Info */}
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 rounded-full bg-[#1dbf73] flex items-center justify-center text-white font-bold text-xl">
                  {gig.owner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{gig.owner.name}</p>
                  <p className="text-sm text-gray-500">{gig.owner.email}</p>
                </div>
              </div>

              {/* Budget */}
              <div className="flex items-center space-x-2 mb-6">
                <AiOutlineDollar className="h-8 w-8 text-[#1dbf73]" />
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="text-3xl font-bold text-[#1dbf73]">${gig.budget}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{gig.description}</p>
              </div>
            </div>

            {/* Bids Section (for Owner) */}
            {isOwner && (
              <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <AiOutlineUser className="h-7 w-7 text-[#1dbf73] mr-2" />
                  Received Bids ({bids.length})
                </h2>

                {bids.length === 0 ? (
                  <div className="text-center py-12">
                    <AiOutlineUser className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No bids yet. Check back later!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bids.map((bid) => (
                      <div
                        key={bid._id}
                        className={`p-6 border rounded-lg ${
                          bid.status === 'hired'
                            ? 'border-[#1dbf73] bg-green-50'
                            : bid.status === 'rejected'
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-[#1dbf73] flex items-center justify-center text-white font-semibold">
                              {bid.freelancerId.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{bid.freelancerId.name}</p>
                              <p className="text-sm text-gray-500">{bid.freelancerId.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#1dbf73]">${bid.price}</p>
                            {bid.status === 'hired' && (
                              <span className="inline-block mt-1 px-3 py-1 bg-[#1dbf73] text-white text-xs font-semibold rounded-full">
                                Hired
                              </span>
                            )}
                            {bid.status === 'rejected' && (
                              <span className="inline-block mt-1 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                                Rejected
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{bid.message}</p>

                        {bid.status === 'pending' && gig.status === 'open' && (
                          <button
                            onClick={() => handleHire(bid._id)}
                            disabled={hiringBidId === bid._id}
                            className="px-6 py-2 bg-[#1dbf73] text-white rounded-md hover:bg-[#19a463] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                          >
                            {hiringBidId === bid._id ? (
                              <>
                                <AiOutlineLoading3Quarters className="animate-spin h-4 w-4" />
                                <span>Hiring...</span>
                              </>
                            ) : (
                              <>
                                <AiOutlineCheckCircle className="h-5 w-5" />
                                <span>Hire</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Bid Form (for non-owners who are authenticated) */}
            {isAuthenticated && !isOwner && (
              <BidForm gigId={id} onBidSubmitted={handleBidSubmitted} />
            )}

            {/* Login Prompt (for non-authenticated users) */}
            {!isAuthenticated && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Want to bid on this gig?</h3>
                <p className="text-gray-600 mb-6">
                  Sign in or create an account to submit your proposal
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-[#1dbf73] text-white py-3 rounded-lg font-semibold hover:bg-[#19a463] transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full border border-[#1dbf73] text-[#1dbf73] py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                  >
                    Sign Up
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

export default GigDetail;
