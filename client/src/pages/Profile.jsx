import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import ListingCard from '../components/ListingCard';
import { getCategoryMeta } from '../utils/constants';
import CategoryIcon from '../components/CategoryIcon';
import { Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const isMe = user?._id === id;

  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/users/${id}`),
      api.get(`/users/${id}/listings`),
      api.get(`/users/${id}/reviews`),
    ]).then(([p, l, r]) => {
      setProfile(p.data);
      setListings(l.data);
      setReviews(r.data);
      setEditForm({ name: p.data.name, bio: p.data.bio || '' });
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', editForm);
      setProfile(res.data);
      updateUser(res.data);
      setEditing(false);
      toast.success('Profile updated');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!profile) return <div className="text-center py-20 text-slate-500">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-2xl font-bold">
              {profile.name[0].toUpperCase()}
            </div>
            <div>
              {editing ? (
                <input
                  className="font-bold text-xl text-slate-800 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              ) : (
                <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
              )}
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={profile.rating || 0} size={15} />
                <span className="text-sm text-slate-500">{profile.rating?.toFixed(1) || '–'} ({profile.reviewCount || 0} reviews)</span>
              </div>
            </div>
          </div>
          {isMe && (
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className="flex items-center gap-1.5 text-sm border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Edit size={14} /> {editing ? (saving ? 'Saving…' : 'Save') : 'Edit'}
            </button>
          )}
        </div>

        {/* Bio */}
        <div className="mt-4">
          {editing ? (
            <textarea
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
              placeholder="Write something about yourself…"
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            />
          ) : profile.bio ? (
            <p className="text-slate-500 text-sm">{profile.bio}</p>
          ) : isMe ? (
            <p className="text-slate-400 text-sm italic">Add a bio to let others know who you are.</p>
          ) : null}
        </div>

        {/* Categories */}
        {profile.categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.categories.map((c) => {
              const cat = getCategoryMeta(c);
              return (
                <span key={c} className="flex items-center gap-1.5 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded">
                  <CategoryIcon name={cat.icon} size={11} className="text-slate-400" />
                  {cat.label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Listings */}
      {listings.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Active listings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {listings.map((l) => <ListingCard key={l._id} listing={{ ...l, user: profile }} />)}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p className="text-slate-400 text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-bold">
                    {r.reviewer.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{r.reviewer.name}</span>
                  <StarRating rating={r.rating} size={13} />
                  <span className="text-xs text-slate-400 ml-auto">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.comment && <p className="text-sm text-slate-500">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
