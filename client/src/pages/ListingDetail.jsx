import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import StarRating from '../components/StarRating';
import { LEVEL_COLORS, getCategoryMeta } from '../utils/constants';
import CategoryIcon from '../components/CategoryIcon';
import { Clock, ArrowLeft, Trash2, Edit, Send } from 'lucide-react';

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ requesterOffer: '', message: '', agreedDeadline: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/listings/${id}`)
      .then((r) => setListing(r.data))
      .catch(() => navigate('/browse'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      toast.success('Listing deleted');
      navigate('/my-listings');
    } catch { toast.error('Failed to delete'); }
  };

  const handleSwapSubmit = async (e) => {
    e.preventDefault();
    if (!form.requesterOffer.trim()) return toast.error('Tell them what you offer');
    setSubmitting(true);
    try {
      await api.post('/swaps', { listingId: id, ...form });
      toast.success('Swap request sent!');
      setShowModal(false);
      setForm({ requesterOffer: '', message: '', agreedDeadline: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!listing) return null;

  const isOwner = user?._id === listing.user._id;
  const cat = getCategoryMeta(listing.offerCategory);

  return (
    <div className="page-wrap"><div className="inner" style={{ maxWidth: '44rem' }}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        {/* Category + level */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="flex items-center gap-1.5 text-sm font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded">
            <CategoryIcon name={cat.icon} size={13} className="text-slate-400" />
            {cat.label}
          </span>
          <span className={`text-sm font-medium px-3 py-1 rounded-full capitalize ${LEVEL_COLORS[listing.offerLevel]}`}>
            {listing.offerLevel}
          </span>
          {listing.timeEstimate && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock size={13} /> {listing.timeEstimate}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{listing.title}</h1>
        {listing.description && <p className="text-slate-500 mb-6">{listing.description}</p>}

        {/* Offer / Want */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-violet-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">They offer</p>
            <p className="font-semibold text-violet-800 text-lg">{listing.offerSkill}</p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">They want</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {listing.wantSkills.map((s, i) => (
                <span key={i} className="text-sm font-medium text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Posted by */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          <Link to={`/profile/${listing.user._id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold">
              {listing.user.name[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{listing.user.name}</p>
              <div className="flex items-center gap-1.5">
                <StarRating rating={listing.user.rating || 0} size={13} />
                <span className="text-xs text-slate-400">({listing.user.reviewCount || 0} reviews)</span>
              </div>
            </div>
          </Link>

          {/* Actions */}
          {isOwner ? (
            <div className="flex gap-2">
              <Link
                to={`/listings/${id}/edit`}
                className="flex items-center gap-1.5 text-sm border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <Edit size={15} /> Edit
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-sm border border-red-200 text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          ) : user ? (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-violet-700 transition-colors"
            >
              <Send size={16} /> Propose Swap
            </button>
          ) : (
            <Link to="/login" className="bg-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-violet-700 transition-colors">
              Log in to swap
            </Link>
          )}
        </div>
      </div>

      {/* Bio if owner has it */}
      {listing.user.bio && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mt-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">About {listing.user.name}</p>
          <p className="text-sm text-slate-600">{listing.user.bio}</p>
        </div>
      )}

      {/* Swap Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Propose a swap with {listing.user.name}</h3>
            <form onSubmit={handleSwapSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">What will you offer? *</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder={`e.g. "I'll design your logo"`}
                  value={form.requesterOffer}
                  onChange={(e) => setForm({ ...form, requesterOffer: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Message <span className="text-slate-400">(optional)</span></label>
                <textarea
                  rows={3}
                  className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                  placeholder="Add any details about your proposalâ€¦"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Suggested deadline <span className="text-slate-400">(optional)</span></label>
                <input
                  type="date"
                  className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={form.agreedDeadline}
                  onChange={(e) => setForm({ ...form, agreedDeadline: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-violet-600 text-white py-2.5 rounded-xl font-semibold hover:bg-violet-700 transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Sendingâ€¦' : 'Send request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div></div>
  );
}
