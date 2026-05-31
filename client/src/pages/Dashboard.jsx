import { useEffect, useState } from 'react';
import api from '../api/axios';
import SwapCard from '../components/SwapCard';
import toast from 'react-hot-toast';

const TABS = ['all', 'pending', 'accepted', 'completed', 'declined', 'cancelled'];

export default function Dashboard() {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  // Modal states
  const [actionModal, setActionModal] = useState(null); // { id, type }
  const [counterMsg, setCounterMsg] = useState('');
  const [agreedScope, setAgreedScope] = useState('');
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });

  const fetchSwaps = async () => {
    try {
      const res = await api.get('/swaps');
      setSwaps(res.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSwaps(); }, []);

  const filtered = tab === 'all' ? swaps : swaps.filter((s) => s.status === tab);

  const handleAction = (id, type) => {
    setActionModal({ id, type });
    setCounterMsg('');
    setAgreedScope('');
    setReviewData({ rating: 0, comment: '' });
  };

  const submitAction = async () => {
    const { id, type } = actionModal;
    try {
      if (type === 'accept') {
        await api.put(`/swaps/${id}/respond`, { action: 'accepted', agreedScope });
        toast.success('Swap accepted!');
      } else if (type === 'counter') {
        await api.put(`/swaps/${id}/respond`, { action: 'countered', counterMessage: counterMsg });
        toast.success('Counter sent');
      } else if (type === 'decline') {
        await api.put(`/swaps/${id}/respond`, { action: 'declined' });
        toast.success('Request declined');
      } else if (type === 'cancel') {
        await api.put(`/swaps/${id}/cancel`);
        toast.success('Request cancelled');
      } else if (type === 'done') {
        await api.put(`/swaps/${id}/done`);
        toast.success('Marked as done!');
      } else if (type === 'review') {
        await api.post(`/swaps/${id}/review`, reviewData);
        toast.success('Review submitted!');
      }
      setActionModal(null);
      fetchSwaps();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Your swaps</h1>
      <p className="text-slate-500 text-sm mb-6">Track all your incoming and outgoing swap requests.</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => {
          const count = t === 'all' ? swaps.length : swaps.filter((s) => s.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tab === t ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {count > 0 && <span className="ml-1.5 text-xs opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-slate-200 h-36 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">ðŸ¤</p>
          <p className="text-slate-500">No swaps here yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => (
            <SwapCard key={s._id} swap={s} onAction={handleAction} />
          ))}
        </div>
      )}

      {/* Action modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            {actionModal.type === 'accept' && (
              <>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Accept & set scope</h3>
                <textarea
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                  placeholder="Agreed scope of work (optional)â€¦"
                  value={agreedScope}
                  onChange={(e) => setAgreedScope(e.target.value)}
                />
              </>
            )}
            {actionModal.type === 'counter' && (
              <>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Send a counter-proposal</h3>
                <textarea
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                  placeholder="Describe your counter-offerâ€¦"
                  value={counterMsg}
                  onChange={(e) => setCounterMsg(e.target.value)}
                />
              </>
            )}
            {actionModal.type === 'decline' && (
              <p className="text-slate-700 mb-4">Are you sure you want to decline this request?</p>
            )}
            {actionModal.type === 'cancel' && (
              <p className="text-slate-700 mb-4">Cancel your swap request?</p>
            )}
            {actionModal.type === 'done' && (
              <p className="text-slate-700 mb-4">Mark your side of the swap as complete?</p>
            )}
            {actionModal.type === 'review' && (
              <>
                <h3 className="text-lg font-bold text-slate-800 mb-3">Leave a review</h3>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: s })}
                      className={`text-2xl transition-transform hover:scale-110 ${s <= reviewData.rating ? 'text-amber-400' : 'text-slate-200'}`}
                    >â˜…</button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                  placeholder="Write a short reviewâ€¦"
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                />
              </>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setActionModal(null)}
                className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl hover:bg-slate-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                className="flex-1 bg-violet-600 text-white py-2.5 rounded-xl font-semibold hover:bg-violet-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
