import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { CATEGORIES, LEVELS } from '../utils/constants';
import CategoryIcon from '../components/CategoryIcon';
import { Plus, X, ArrowLeft } from 'lucide-react';

const label = (text, optional = false) => (
  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
    {text} {optional && <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span>}
  </label>
);

export default function CreateListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [wantInput, setWantInput] = useState('');
  const [form, setForm] = useState({
    title: '', offerSkill: '', offerCategory: '', offerLevel: 'mid',
    wantSkills: [], wantCategories: [], description: '', timeEstimate: '',
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

  const removeWant = (s) => setForm({ ...form, wantSkills: form.wantSkills.filter((x) => x !== s) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.offerCategory) return toast.error('Select a skill category.');
    if (!form.wantSkills.length) return toast.error('Add at least one skill you want in return.');
    setLoading(true);
    try {
      if (id) { await api.put(`/listings/${id}`, form); toast.success('Listing updated.'); }
      else     { await api.post('/listings', form);      toast.success('Listing posted.'); }
      navigate('/my-listings');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '0.625rem 0.875rem', fontSize: '0.875rem',
    color: '#0f172a', background: '#fff', border: '1.5px solid #cbd5e1',
    borderRadius: '0.5rem', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
  };
  const focusIn  = (e) => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; };
  const focusOut = (e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; };

  return (
    <div className="page-wrap">
      <div className="inner" style={{ maxWidth: '40rem' }}>

        {/* Back */}
        <button onClick={() => navigate(-1)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}>
          <ArrowLeft size={15} /> Back
        </button>

        {/* Heading */}
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
          {id ? 'Edit listing' : 'Post a listing'}
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '2rem' }}>
          Tell the community what you offer and what you want in return.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.875rem', padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Title */}
            <div>
              {label('Listing title')}
              <input
                required style={inputStyle}
                placeholder="e.g. I'll build your React app in exchange for copywriting"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                onFocus={focusIn} onBlur={focusOut}
              />
            </div>

            {/* Offer + Level */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                {label('Skill I\'m offering')}
                <input
                  required style={inputStyle}
                  placeholder="e.g. React development"
                  value={form.offerSkill}
                  onChange={(e) => setForm({ ...form, offerSkill: e.target.value })}
                  onFocus={focusIn} onBlur={focusOut}
                />
              </div>
              <div>
                {label('My level')}
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={form.offerLevel}
                  onChange={(e) => setForm({ ...form, offerLevel: e.target.value })}
                  onFocus={focusIn} onBlur={focusOut}
                >
                  {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              {label('Skill category')}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '0.25rem' }}>
                {CATEGORIES.map((cat) => {
                  const sel = form.offerCategory === cat.value;
                  return (
                    <button key={cat.value} type="button"
                      onClick={() => setForm({ ...form, offerCategory: cat.value })}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem',
                        padding: '0.75rem 0.5rem', borderRadius: '0.5rem', cursor: 'pointer',
                        border: sel ? '2px solid #7c3aed' : '2px solid #e2e8f0',
                        background: sel ? '#f5f3ff' : '#fafafa',
                        color: sel ? '#5b21b6' : '#64748b',
                        fontSize: '0.75rem', fontWeight: 500, transition: 'all 0.15s',
                      }}>
                      <CategoryIcon name={cat.icon} size={16} className={sel ? 'text-violet-600' : 'text-slate-400'} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Want skills */}
            <div>
              {label('Skills I want in return')}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="e.g. Copywriting, Logo design — press Enter to add"
                  value={wantInput}
                  onChange={(e) => setWantInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addWant())}
                  onFocus={focusIn} onBlur={focusOut}
                />
                <button type="button" onClick={addWant}
                  style={{ padding: '0.625rem 0.875rem', background: '#f5f3ff', color: '#7c3aed', border: '1.5px solid #ddd6fe', borderRadius: '0.5rem', cursor: 'pointer' }}>
                  <Plus size={16} />
                </button>
              </div>
              {form.wantSkills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {form.wantSkills.map((s) => (
                    <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: '#f5f3ff', color: '#5b21b6', fontSize: '0.8125rem', fontWeight: 500, padding: '0.3rem 0.75rem', borderRadius: '9999px', border: '1px solid #ddd6fe' }}>
                      {s}
                      <button type="button" onClick={() => removeWant(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', display: 'flex', padding: 0 }}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              {label('Description', true)}
              <textarea
                rows={3}
                style={{ ...inputStyle, resize: 'none' }}
                placeholder="Describe what you'll deliver, your experience, and what you're looking for..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                onFocus={focusIn} onBlur={focusOut}
              />
            </div>

            {/* Time estimate */}
            <div>
              {label('Time estimate', true)}
              <input
                style={inputStyle}
                placeholder="e.g. 3–5 hours, 1 week"
                value={form.timeEstimate}
                onChange={(e) => setForm({ ...form, timeEstimate: e.target.value })}
                onFocus={focusIn} onBlur={focusOut}
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.5rem' }}>
              {loading ? 'Saving…' : id ? 'Update listing' : 'Post listing'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
