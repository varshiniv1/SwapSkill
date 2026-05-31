import { useEffect, useState } from 'react';
import api from '../api/axios';
import SwapCard from '../components/SwapCard';
import toast from 'react-hot-toast';
import { Repeat2 } from 'lucide-react';

const TABS = ['all', 'pending', 'accepted', 'completed', 'declined', 'cancelled'];

export default function Dashboard() {
  const [swaps, setSwaps]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState('all');
  const [actionModal, setActionModal] = useState(null);
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
      if (type === 'accept')  await api.put(`/swaps/${id}/respond`, { action: 'accepted', agreedScope });
      if (type === 'counter') await api.put(`/swaps/${id}/respond`, { action: 'countered', counterMessage: counterMsg });
      if (type === 'decline') await api.put(`/swaps/${id}/respond`, { action: 'declined' });
      if (type === 'cancel')  await api.put(`/swaps/${id}/cancel`);
      if (type === 'done')    await api.put(`/swaps/${id}/done`);
      if (type === 'review')  await api.post(`/swaps/${id}/review`, reviewData);
      toast.success('Done!');
      setActionModal(null);
      fetchSwaps();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  /* ── pill style ─────────────────────── */
  const tabPill = (active) => ({
    padding: '0.375rem 1rem',
    fontSize: '0.8125rem', fontWeight: 500,
    borderRadius: '9999px', cursor: 'pointer',
    border: active ? '1.5px solid #7c3aed' : '1.5px solid #e2e8f0',
    background: active ? '#7c3aed' : '#fff',
    color: active ? '#fff' : '#475569',
    transition: 'all 0.15s', whiteSpace: 'nowrap',
  });

  const inputStyle = {
    width: '100%', padding: '0.625rem 0.875rem', fontSize: '0.875rem',
    color: '#0f172a', background: '#fff', border: '1.5px solid #cbd5e1',
    borderRadius: '0.5rem', outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };
  const focusIn  = (e) => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; };
  const focusOut = (e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; };

  return (
    <div className="page-wrap">
      <div className="inner" style={{ maxWidth: '48rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Your swaps</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Track all your incoming and outgoing swap requests.</p>
        </div>

        {/* Tab pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          {TABS.map((t) => {
            const count = t === 'all' ? swaps.length : swaps.filter((s) => s.status === t).length;
            return (
              <button key={t} onClick={() => setTab(t)} style={tabPill(tab === t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {count > 0 && (
                  <span style={{ marginLeft: '0.375rem', fontSize: '0.7rem', opacity: 0.75 }}>({count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #f1f5f9', height: '9rem' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Repeat2 size={20} style={{ color: '#7c3aed' }} />
            </div>
            <p style={{ fontSize: '0.9375rem', color: '#64748b', fontWeight: 500 }}>No swaps here yet.</p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              {tab === 'all' ? 'Browse listings and propose your first swap.' : `No ${tab} swaps.`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((s) => (
              <SwapCard key={s._id} swap={s} onAction={handleAction} />
            ))}
          </div>
        )}
      </div>

      {/* Action modal */}
      {actionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '24rem', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>

            {actionModal.type === 'accept' && (
              <>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Accept swap</h3>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Agreed scope (optional)</label>
                <textarea rows={3} style={{ ...inputStyle, resize: 'none' }} placeholder="Briefly describe what both sides will deliver..." value={agreedScope} onChange={(e) => setAgreedScope(e.target.value)} onFocus={focusIn} onBlur={focusOut} />
              </>
            )}
            {actionModal.type === 'counter' && (
              <>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Send a counter-proposal</h3>
                <textarea rows={3} style={{ ...inputStyle, resize: 'none' }} placeholder="Describe your counter-offer..." value={counterMsg} onChange={(e) => setCounterMsg(e.target.value)} onFocus={focusIn} onBlur={focusOut} />
              </>
            )}
            {actionModal.type === 'decline' && (
              <p style={{ color: '#374151', marginBottom: '1rem' }}>Decline this swap request?</p>
            )}
            {actionModal.type === 'cancel' && (
              <p style={{ color: '#374151', marginBottom: '1rem' }}>Cancel your swap request?</p>
            )}
            {actionModal.type === 'done' && (
              <p style={{ color: '#374151', marginBottom: '1rem' }}>Mark your side of the swap as complete?</p>
            )}
            {actionModal.type === 'review' && (
              <>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Leave a review</h3>
                <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1rem' }}>
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: s })}
                      style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: s <= reviewData.rating ? '#f59e0b' : '#e2e8f0', transition: 'color 0.1s' }}>
                      ★
                    </button>
                  ))}
                </div>
                <textarea rows={3} style={{ ...inputStyle, resize: 'none' }} placeholder="Write a short review..." value={reviewData.comment} onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })} onFocus={focusIn} onBlur={focusOut} />
              </>
            )}

            <div style={{ display: 'flex', gap: '0.625rem', marginTop: '1.5rem' }}>
              <button onClick={() => setActionModal(null)}
                style={{ flex: 1, padding: '0.7rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={submitAction}
                style={{ flex: 1, padding: '0.7rem', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: '#7c3aed', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
