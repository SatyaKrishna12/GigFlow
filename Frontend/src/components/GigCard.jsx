import { Link } from 'react-router-dom';
import { AiOutlineDollar, AiOutlineMessage, AiOutlineCheckCircle, AiOutlineClockCircle } from 'react-icons/ai';

const GigCard = ({ gig }) => {
  const getStatusDisplay = () => {
    if (gig.status === 'assigned') {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
          <AiOutlineCheckCircle className="h-3 w-3" />
          Assigned
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1">
        <AiOutlineClockCircle className="h-3 w-3" />
        Open
      </span>
    );
  };

  return (
    <Link
      to={`/gigs/${gig._id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
    >
      {/* Card Header */}
      <div className="p-6">
        {/* Gig Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-[#1dbf73] transition-colors">
          {gig.title}
        </h3>

        {/* Gig Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{gig.description}</p>

        {/* Budget */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <AiOutlineDollar className="h-5 w-5 text-[#1dbf73]" />
            <span className="text-2xl font-bold text-[#1dbf73]">${gig.budget}</span>
          </div>

          {/* Bids Count */}
          {gig.bidsCount !== undefined && (
            <div className="flex items-center space-x-1 text-gray-500 text-sm">
              <AiOutlineMessage className="h-4 w-4" />
              <span>{gig.bidsCount} {gig.bidsCount === 1 ? 'bid' : 'bids'}</span>
            </div>
          )}
        </div>

        {/* Owner Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#1dbf73] flex items-center justify-center text-white font-semibold">
              {gig.owner?.name?.charAt(0).toUpperCase() || gig.ownerId?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-gray-700 font-medium">{gig.owner?.name || gig.ownerId?.name || 'Anonymous'}</span>
          </div>

          {/* Status Badge */}
          {getStatusDisplay()}
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
