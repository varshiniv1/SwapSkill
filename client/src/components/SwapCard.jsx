import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, MessageSquare, Clock } from 'lucide-react';
import { STATUS_COLORS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export default function SwapCard({ swap, onAction }) {
  const { user } = useAuth();
  const isOwner = swap.listingOwner._id === user._id;
  const isRequester = swap.requester._id === user._id;
  const other = isOwner ? swap.requester : swap.listingOwner;

  const myDone = isRequester ? swap.requesterDone : swap.ownerDone;
  const theirDone = isRequester ? swap.ownerDone : swap.requesterDone;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3">
      {/* Status badge + listing */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link to={`/listings/${swap.listing?._id}`} className="text-sm font-semibold text-slate-800 hover:text-violet-600">
            {swap.listing?.title || 'Deleted listing'}
          </Link>
          <p className="text-xs text-slate-400 mt-0.5">
            {isOwner ? `Request from ${other.name}` : `Your request to ${other.name}`}
          </p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${STATUS_COLORS[swap.status]}`}>
          {swap.status}
        </span>
      </div>

      {/* Offer + message */}
      <div className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 space-y-1">
        <p><span className="font-medium">Their offer:</span> {swap.requesterOffer}</p>
        {swap.message && <p className="text-slate-500 italic">"{swap.message}"</p>}
        {swap.counterMessage && (
          <p className="text-orange-600 italic">Counter: "{swap.counterMessage}"</p>
        )}
        {swap.agreedScope && (
          <p><span className="font-medium">Agreed scope:</span> {swap.agreedScope}</p>
        )}
        {swap.agreedDeadline && (
          <p className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={12} />
            Deadline: {new Date(swap.agreedDeadline).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-1">
        {/* Owner can accept/counter/decline pending requests */}
        {isOwner && swap.status === 'pending' && (
          <>
            <button
              onClick={() => onAction(swap._id, 'accept')}
              className="flex items-center gap-1 text-sm bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              <CheckCircle size={15} /> Accept
            </button>
            <button
              onClick={() => onAction(swap._id, 'counter')}
              className="flex items-center gap-1 text-sm bg-orange-50 text-orange-700 hover:bg-orange-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              <MessageSquare size={15} /> Counter
            </button>
            <button
              onClick={() => onAction(swap._id, 'decline')}
              className="flex items-center gap-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              <XCircle size={15} /> Decline
            </button>
          </>
        )}

        {/* Requester can cancel pending */}
        {isRequester && ['pending', 'countered'].includes(swap.status) && (
          <button
            onClick={() => onAction(swap._id, 'cancel')}
            className="text-sm text-slate-500 hover:text-red-500 transition-colors"
          >
            Cancel request
          </button>
        )}

        {/* Accepted — mark done */}
        {swap.status === 'accepted' && !myDone && (
          <button
            onClick={() => onAction(swap._id, 'done')}
            className="flex items-center gap-1 text-sm bg-violet-600 text-white hover:bg-violet-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            <CheckCircle size={15} /> Mark my side done
          </button>
        )}

        {/* Waiting on other side */}
        {swap.status === 'accepted' && myDone && !theirDone && (
          <span className="text-xs text-slate-400 italic">Waiting for {other.name} to mark done…</span>
        )}

        {/* Completed — leave review */}
        {swap.status === 'completed' && (
          <button
            onClick={() => onAction(swap._id, 'review')}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            ★ Leave a review
          </button>
        )}
      </div>
    </div>
  );
}
