import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { LEVEL_COLORS, getCategoryMeta } from '../utils/constants';
import CategoryIcon from '../components/CategoryIcon';
import { PlusCircle, Edit, Trash2, ToggleLeft, ToggleRight, FileText } from 'lucide-react';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetch = async () => {
    try { const res = await api.get('/listings/mine'); setListings(res.data); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try { await api.delete(`/listings/${id}`); toast.success('Listing deleted.'); setListings((p) => p.filter((l) => l._id !== id)); }
    catch { toast.error('Failed to delete.'); }
  };

  const toggleActive = async (listing) => {
    try {
      const res = await api.put(`/listings/${listing._id}`, { ...listing, isActive: !listing.isActive });
      setListings((p) => p.map((l) => l._id === listing._id ? res.data : l));
      toast.success(res.data.isActive ? 'Listing activated.' : 'Listing paused.');
    } catch { toast.error('Failed to update.'); }
  };

  return (
    <div className="page-wrap">
      <div className="inner" style={{ maxWidth: '48rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>My listings</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {listings.length} listing{listings.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/listings/new"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#7c3aed', color: '#fff', fontWeight: 600, fontSize: '0.875rem', padding: '0.625rem 1.125rem', borderRadius: '0.5rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            <PlusCircle size={16} /> New listing
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #f1f5f9', height: '5rem' }} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <FileText size={20} style={{ color: '#7c3aed' }} />
            </div>
            <p style={{ fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>No listings yet</p>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>Post your first listing and start swapping skills.</p>
            <Link to="/listings/new"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#7c3aed', color: '#fff', fontWeight: 600, fontSize: '0.875rem', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', textDecoration: 'none' }}>
              <PlusCircle size={15} /> Post a listing
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {listings.map((l) => {
              const cat = getCategoryMeta(l.offerCategory);
              return (
                <div key={l._id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem',
                  padding: '1rem 1.25rem', opacity: l.isActive ? 1 : 0.55,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  {/* Icon */}
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CategoryIcon name={cat.icon} size={15} className="text-slate-400" />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>{l.offerSkill}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.125rem 0.5rem', borderRadius: '9999px', textTransform: 'capitalize', background: '#f1f5f9', color: '#475569' }}>{l.offerLevel}</span>
                      {!l.isActive && <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Paused</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                    <button onClick={() => toggleActive(l)} title={l.isActive ? 'Pause' : 'Activate'}
                      style={{ padding: '0.375rem', borderRadius: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: l.isActive ? '#7c3aed' : '#94a3b8' }}>
                      {l.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                    <Link to={`/listings/${l._id}/edit`}
                      style={{ padding: '0.375rem', borderRadius: '0.375rem', color: '#64748b', display: 'flex' }}>
                      <Edit size={16} />
                    </Link>
                    <button onClick={() => handleDelete(l._id)}
                      style={{ padding: '0.375rem', borderRadius: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
