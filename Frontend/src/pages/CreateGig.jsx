import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlinePlus, AiOutlineLoading3Quarters } from 'react-icons/ai';
import api from '../services/api';

const CreateGig = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!title.trim() || !description.trim() || !budget) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (budget <= 0) {
      toast.error('Budget must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      await api.post('/gigs', {
        title: title.trim(),
        description: description.trim(),
        budget: Number(budget),
      });

      toast.success('Gig created successfully!');
      // Redirect to gigs page on success
      navigate('/gigs');
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create a New Gig</h1>
          <p className="text-gray-600">
            Post your project and receive bids from talented freelancers
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gig Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Build a responsive landing page"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none"
                disabled={loading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Write a clear, descriptive title for your project
              </p>
            </div>

            {/* Description Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project in detail. Include requirements, deliverables, and timeline..."
                rows="8"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none resize-none"
                disabled={loading}
              />
              <p className="mt-1 text-sm text-gray-500">
                Provide comprehensive details to attract the right freelancers
              </p>
            </div>

            {/* Budget Input */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget ($)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500 text-lg font-semibold">$</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none"
                  disabled={loading}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Set your maximum budget for this project
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#1dbf73] text-white py-3 rounded-lg font-semibold hover:bg-[#19a463] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 text-white" />
                    <span>Creating Gig...</span>
                  </>
                ) : (
                  <>
                    <AiOutlinePlus className="h-5 w-5" />
                    <span>Post Gig</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/gigs')}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;
