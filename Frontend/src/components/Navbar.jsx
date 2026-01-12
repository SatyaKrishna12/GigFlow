import { Link, useNavigate } from 'react-router-dom';
import { AiOutlinePlus, AiOutlineUser, AiOutlineLogout, AiOutlineDashboard } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-[#1dbf73] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">
              G
            </div>
            <span className="text-2xl font-bold text-gray-800">
              Gig<span className="text-[#1dbf73]">Flow</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/gigs"
              className="text-gray-700 hover:text-[#1dbf73] font-medium transition-colors"
            >
              Browse Gigs
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-[#1dbf73] font-medium transition-colors"
                >
                  <AiOutlineDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/create-gig"
                  className="flex items-center space-x-1 text-gray-700 hover:text-[#1dbf73] font-medium transition-colors"
                >
                  <AiOutlinePlus className="h-5 w-5" />
                  <span>Create Gig</span>
                </Link>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
                    <AiOutlineUser className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
                  >
                    <AiOutlineLogout className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-[#1dbf73] font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#1dbf73] text-white rounded-md hover:bg-[#19a463] transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
