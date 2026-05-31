import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { LEVEL_COLORS, getCategoryMeta } from '../utils/constants';
import CategoryIcon from '../components/CategoryIcon';
import { PlusCircle, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetch = async () => {
    try {
      const res = await api.get('/listings/mine');
      setListings(res.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      toast.success('Deleted');
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  const toggleActive = async (listing) => {
    try {
      const updated = await api.put(`/listings/${listing._id}`, { ...listing, isActive: !listing.isActive });
      setListings((prev) => prev.map((l) => l._id === listing._id ? updated.data : l));
      toast.success(updated.data.isActive ? 'Listing activated' : 'Listing paused');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My listings</h1>
          <p className="text-slate-500 text-sm">{listings.length} listing{listings.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          to="/listings/new"
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          <PlusCircle size={16} /> New listing
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-slate-200 h-24 animate-pulse" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-500 mb-4">No listings yet.</p>
          <Link to="/listings/new" className="bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors">
            Post your first listing
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((l) => {
            const cat = getCategoryMeta(l.offerCategory);
            return (
              <div key={l._id} className={`bg-white rounded-lg border p-4 flex items-center gap-4 ${l.isActive ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
                <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                  <CategoryIcon name={cat.icon} size={15} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{l.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-slate-400">{l.offerSkill}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${LEVEL_COLORS[l.offerLevel]}`}>{l.offerLevel}</span>
                    {!l.isActive && <span className="text-xs text-slate-400">Paused</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleActive(l)}
                    className="text-slate-400 hover:text-violet-600 transition-colors p-1.5 rounded-lg hover:bg-violet-50"
                    title={l.isActive ? 'Pause' : 'Activate'}
                  >
                    {l.isActive ? <ToggleRight size={20} className="text-violet-600" /> : <ToggleLeft size={20} />}
                  </button>
                  <Link
                    to={`/listings/${l._id}/edit`}
                    className="text-slate-400 hover:text-violet-600 transition-colors p-1.5 rounded-lg hover:bg-violet-50"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(l._id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
