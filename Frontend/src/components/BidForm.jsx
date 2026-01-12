import { useState } from 'react';
import { toast } from 'react-toastify';
import { AiOutlineDollar, AiOutlineCheckCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import api from '../services/api';

const BidForm = ({ gigId, onBidSubmitted }) => {
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!message.trim() || !price) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (price <= 0) {
      toast.error('Price must be greater than 0');
      setLoading(false);
      return;
    }

    try {
      await api.post('/bids', {
        gigId: gigId,
        message: message.trim(),
        price: Number(price),
      });

      // Reset form
      setMessage('');
      setPrice('');
      
      toast.success('Bid submitted successfully!');

      // Callback to parent to refresh bids
      if (onBidSubmitted) {
        onBidSubmitted();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <AiOutlineDollar className="h-6 w-6 text-[#1dbf73] mr-2" />
        Place Your Bid
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Message Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Proposal
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe why you're the best fit for this gig..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none resize-none"
            disabled={loading}
          />
        </div>

        {/* Price Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Bid Amount ($)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-500 text-lg">$</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent outline-none"
              disabled={loading}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1dbf73] text-white py-3 rounded-lg font-semibold hover:bg-[#19a463] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 text-white" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <AiOutlineCheckCircle className="h-5 w-5" />
              <span>Submit Bid</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BidForm;
