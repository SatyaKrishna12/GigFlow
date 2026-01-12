import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const result = await register(name, email, password);

      if (result.success) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        // Show the specific error message from backend
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      // Catch any unexpected errors
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1dbf73] to-[#19a463] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-lg">
            <div className="bg-[#1dbf73] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">
              G
            </div>
            <span className="text-2xl font-bold text-gray-800">
              Gig<span className="text-[#1dbf73]">Flow</span>
            </span>
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Create Account</h2>
          <p className="text-gray-600 text-center mb-6">Join GigFlow today</p>

          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <AiOutlineUser className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <AiOutlineMail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">
                  <AiOutlineLock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none"
                  disabled={loading}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1dbf73] text-white py-3 rounded-lg font-semibold hover:bg-[#19a463] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 text-white" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#1dbf73] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
