import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import ListingCard from '../components/ListingCard';
import { getCategoryMeta } from '../utils/constants';
import CategoryIcon from '../components/CategoryIcon';
import { Edit, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const isMe = user?._id === id;

  const [profile, setProfile]   = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    Promise.all([api.get(`/users/${id}`), api.get(`/users/${id}/listings`), api.get(`/users/${id}/reviews`)])
      .then(([p, l, r]) => {
        setProfile(p.data); setListings(l.data); setReviews(r.data);
        setEditForm({ name: p.data.name, bio: p.data.bio || '' });
      }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', editForm);
      setProfile(res.data); updateUser(res.data); setEditing(false);
      toast.success('Profile updated.');
    } catch { toast.error('Failed to save.'); }
    finally { setSaving(false); }
  };

  const inputStyle = {
    width: '100%', padding: '0.625rem 0.875rem', fontSize: '0.875rem',
    color: '#0f172a', background: '#fff', border: '1.5px solid #cbd5e1',
    borderRadius: '0.5rem', outline: 'none',
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: '2rem', height: '2rem', border: '3px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );
  if (!profile) return <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>User not found.</div>;

  return (
    <div className="page-wrap">
      <div className="inner" style={{ maxWidth: '52rem' }}>

        {/* Profile card */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Avatar */}
              <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, color: '#5b21b6', flexShrink: 0 }}>
                {profile.name[0].toUpperCase()}
              </div>
              <div>
                {editing ? (
                  <input style={{ ...inputStyle, fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}
                    value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                ) : (
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>{profile.name}</h2>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <StarRating rating={profile.rating || 0} size={14} />
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    {profile.rating ? profile.rating.toFixed(1) : '—'} ({profile.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            {isMe && (
              <button onClick={() => editing ? handleSave() : setEditing(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', fontSize: '0.8125rem', fontWeight: 600, color: editing ? '#fff' : '#374151', background: editing ? '#7c3aed' : '#fff', border: editing ? 'none' : '1.5px solid #e2e8f0', borderRadius: '0.5rem', cursor: 'pointer' }}>
                {editing ? <><Check size={13} /> {saving ? 'Saving…' : 'Save'}</> : <><Edit size={13} /> Edit</>}
              </button>
            )}
          </div>

          {/* Bio */}
          <div style={{ marginTop: '1.25rem' }}>
            {editing ? (
              <textarea rows={2} style={{ ...inputStyle, resize: 'none' }}
                placeholder="Write something about yourself..."
                value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} />
            ) : profile.bio ? (
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.65 }}>{profile.bio}</p>
            ) : isMe ? (
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', fontStyle: 'italic' }}>Add a bio to let others know who you are.</p>
            ) : null}
          </div>

          {/* Categories */}
          {profile.categories?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
              {profile.categories.map((c) => {
                const cat = getCategoryMeta(c);
                return (
                  <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 500, background: '#f8fafc', color: '#475569', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #e2e8f0' }}>
                    <CategoryIcon name={cat.icon} size={11} className="text-slate-400" /> {cat.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Active listings */}
        {listings.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Active listings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listings.map((l) => <ListingCard key={l._id} listing={{ ...l, user: profile }} />)}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            Reviews ({reviews.length})
          </h3>
          {reviews.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>No reviews yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {reviews.map((r) => (
                <div key={r._id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.125rem 1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#5b21b6' }}>
                      {r.reviewer.name[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{r.reviewer.name}</span>
                    <StarRating rating={r.rating} size={13} />
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: 'auto' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  {r.comment && <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.65 }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
