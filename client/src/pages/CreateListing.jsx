import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { CATEGORIES, LEVELS } from '../utils/constants';
import CategoryIcon from '../components/CategoryIcon';
import { Plus, X, ArrowLeft } from 'lucide-react';

export default function CreateListing() {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [wantInput, setWantInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    offerSkill: '',
    offerCategory: '',
    offerLevel: 'mid',
    wantSkills: [],
    wantCategories: [],
    description: '',
    timeEstimate: '',
  });

  useEffect(() => {
    if (id) {
      api.get(`/listings/${id}`).then((r) => {
        const { title, offerSkill, offerCategory, offerLevel, wantSkills, wantCategories, description, timeEstimate } = r.data;
        setForm({ title, offerSkill, offerCategory, offerLevel, wantSkills, wantCategories: wantCategories || [], description: description || '', timeEstimate: timeEstimate || '' });
      }).catch(() => navigate('/my-listings'));
    }
  }, [id]);

  const addWant = () => {
    const val = wantInput.trim();
    if (!val || form.wantSkills.includes(val)) return;
    setForm({ ...form, wantSkills: [...form.wantSkills, val] });
    setWantInput('');
  };

  const removeWant = (s) =>
    setForm({ ...form, wantSkills: form.wantSkills.filter((x) => x !== s) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.offerCategory) return toast.error('Pick a category');
    if (form.wantSkills.length === 0) return toast.error('Add at least one skill you want');
    setLoading(true);
    try {
      if (id) {
        await api.put(`/listings/${id}`, form);
        toast.success('Listing updated!');
      } else {
        await api.post('/listings', form);
        toast.success('Listing posted!');
      }
      navigate('/my-listings');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-bold text-slate-800 mb-1">{id ? 'Edit listing' : 'Post a listing'}</h1>
      <p className="text-slate-500 text-sm mb-8">Tell the community what you offer and what you want in return.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="text-sm font-medium text-slate-700">Listing title *</label>
          <input
            required
            className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="e.g. I'll build your React app for copywriting help"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Offer */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Skill I'm offering *</label>
            <input
              required
              className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="e.g. React development"
              value={form.offerSkill}
              onChange={(e) => setForm({ ...form, offerSkill: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">My level *</label>
            <select
              className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
              value={form.offerLevel}
              onChange={(e) => setForm({ ...form, offerLevel: e.target.value })}
            >
              {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-slate-700">Skill category *</label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {CATEGORIES.map((cat) => {
              const selected = form.offerCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm({ ...form, offerCategory: cat.value })}
                  className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg border-2 text-xs font-medium transition-all ${
                    selected
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <CategoryIcon name={cat.icon} size={15} className={selected ? 'text-violet-600' : 'text-slate-400'} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Want skills */}
        <div>
          <label className="text-sm font-medium text-slate-700">Skills I want in return *</label>
          <div className="flex gap-2 mt-1">
            <input
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="e.g. Copywriting, Logo design…"
              value={wantInput}
              onChange={(e) => setWantInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addWant())}
            />
            <button
              type="button"
              onClick={addWant}
              className="bg-violet-100 text-violet-700 px-3 rounded-xl hover:bg-violet-200 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          {form.wantSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.wantSkills.map((s) => (
                <span key={s} className="flex items-center gap-1 bg-violet-50 text-violet-700 text-sm px-3 py-1 rounded-full">
                  {s}
                  <button type="button" onClick={() => removeWant(s)}><X size={13} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description + time */}
        <div>
          <label className="text-sm font-medium text-slate-700">Description <span className="text-slate-400">(optional)</span></label>
          <textarea
            rows={3}
            className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
            placeholder="Describe what you'll deliver, your experience, and what you're looking for…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Time estimate <span className="text-slate-400">(optional)</span></label>
          <input
            className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="e.g. 3-5 hours, 1 week"
            value={form.timeEstimate}
            onChange={(e) => setForm({ ...form, timeEstimate: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 text-white font-semibold py-3 rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Saving…' : id ? 'Update listing' : 'Post listing'}
        </button>
      </form>
    </div>
  );
}
