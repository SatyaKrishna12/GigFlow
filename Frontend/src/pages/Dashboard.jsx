import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters, AiOutlineFolderOpen, AiOutlineFileText, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineClockCircle, AiOutlineDollar } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('myGigs'); // 'myGigs' or 'myBids'
  const [myGigs, setMyGigs] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Listen for real-time hired notifications
  useEffect(() => {
    if (!socket) return;

    const handleHiredNotification = (data) => {
      console.log('📥 Received hired notification:', data);
      
      // Show toast notification
      toast.success(data.message, {
        autoClose: 5000,
        className: 'text-lg font-semibold',
        progressClassName: 'bg-green-500'
      });

      // Refresh dashboard data to show updated status
      fetchDashboardData();
    };

    socket.on('hired', handleHiredNotification);

    // Cleanup listener on unmount
    return () => {
      socket.off('hired', handleHiredNotification);
    };
  }, [socket]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch user's gigs and bids in parallel
      const [gigsResponse, bidsResponse] = await Promise.all([
        api.get('/gigs/my/all'),
        api.get('/bids/my/all')
      ]);

      setMyGigs(gigsResponse.data.gigs || []);
      setMyBids(bidsResponse.data.bids || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { color: 'bg-blue-500', icon: AiOutlineClockCircle, text: 'Open' },
      assigned: { color: 'bg-green-500', icon: AiOutlineCheckCircle, text: 'Assigned' },
      pending: { color: 'bg-yellow-500', icon: AiOutlineClockCircle, text: 'Pending' },
      hired: { color: 'bg-green-500', icon: AiOutlineCheckCircle, text: 'Hired' },
      rejected: { color: 'bg-red-500', icon: AiOutlineCloseCircle, text: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <AiOutlineLoading3Quarters className="animate-spin h-12 w-12 text-[#1dbf73]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('myGigs')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'myGigs'
                  ? 'bg-[#1dbf73] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <AiOutlineFolderOpen className="h-5 w-5" />
              My Posted Gigs ({myGigs.length})
            </button>
            <button
              onClick={() => setActiveTab('myBids')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'myBids'
                  ? 'bg-[#1dbf73] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <AiOutlineFileText className="h-5 w-5" />
              My Submitted Bids ({myBids.length})
            </button>
          </div>
        </div>

        {/* My Gigs Tab */}
        {activeTab === 'myGigs' && (
          <div className="space-y-4">
            {myGigs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
                <AiOutlineFolderOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Gigs Posted</h3>
                <p className="text-gray-500 mb-6">You haven't posted any gigs yet.</p>
                <button
                  onClick={() => navigate('/create-gig')}
                  className="px-6 py-3 bg-[#1dbf73] text-white rounded-lg font-semibold hover:bg-[#19a463] transition-colors"
                >
                  Post Your First Gig
                </button>
              </div>
            ) : (
              myGigs.map((gig) => (
                <div
                  key={gig._id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/gigs/${gig._id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{gig.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{gig.description}</p>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(gig.status)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center text-[#1dbf73]">
                      <AiOutlineDollar className="h-5 w-5" />
                      <span className="text-lg font-bold ml-1">${gig.budget}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(gig.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* My Bids Tab */}
        {activeTab === 'myBids' && (
          <div className="space-y-4">
            {myBids.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
                <AiOutlineFileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bids Submitted</h3>
                <p className="text-gray-500 mb-6">You haven't submitted any bids yet.</p>
                <button
                  onClick={() => navigate('/gigs')}
                  className="px-6 py-3 bg-[#1dbf73] text-white rounded-lg font-semibold hover:bg-[#19a463] transition-colors"
                >
                  Browse Available Gigs
                </button>
              </div>
            ) : (
              myBids.map((bid) => (
                <div
                  key={bid._id}
                  className={`bg-white rounded-lg shadow-md p-6 border-2 transition-shadow ${
                    bid.status === 'hired'
                      ? 'border-green-500 bg-green-50'
                      : bid.status === 'rejected'
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className="text-xl font-bold text-gray-800 hover:text-[#1dbf73] cursor-pointer"
                          onClick={() => navigate(`/gigs/${bid.gigId._id}`)}
                        >
                          {bid.gigId.title}
                        </h3>
                        {getStatusBadge(bid.status)}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        Posted by: {bid.gigId.ownerId.name} ({bid.gigId.ownerId.email})
                      </p>
                      {bid.message && (
                        <div className="bg-gray-100 p-3 rounded-md mb-3">
                          <p className="text-sm text-gray-700"><strong>Your proposal:</strong> {bid.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-[#1dbf73]">
                        <AiOutlineDollar className="h-5 w-5" />
                        <span className="text-lg font-bold ml-1">Your Bid: ${bid.price}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Gig Budget: ${bid.gigId.budget}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      Submitted: {new Date(bid.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {bid.status === 'hired' && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md">
                      <p className="text-green-800 font-semibold text-sm">
                         Congratulations! You've been hired for this gig!
                      </p>
                    </div>
                  )}
                  {bid.status === 'rejected' && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
                      <p className="text-red-800 text-sm">
                        This bid was not selected. Keep trying!
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
