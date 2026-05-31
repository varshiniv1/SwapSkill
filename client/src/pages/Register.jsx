import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../utils/constants';
import CategoryIcon from '../components/CategoryIcon';
import toast from 'react-hot-toast';
import { Repeat2, User, Mail, Lock, FileText } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', bio: '', categories: [] });

  const toggle = (val) =>
    setForm((p) => ({
      ...p,
      categories: p.categories.includes(val) ? p.categories.filter((c) => c !== val) : [...p.categories, val],
    }));

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) return toast.error('Please fill in all required fields.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!form.categories.length) return toast.error('Select at least one skill category.');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created. Welcome!');
      navigate('/browse');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const inputIcon = (Icon) => (
    <Icon size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 4rem)', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '26rem' }}>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', textDecoration: 'none' }}>
          <Repeat2 size={20} style={{ color: '#7c3aed' }} />
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>SwapSkill</span>
        </Link>

        <div className="auth-card">

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
            {[{ n: 1, label: 'Your details' }, { n: 2, label: 'Skill areas' }].map(({ n, label }, i, arr) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700,
                  background: step >= n ? '#7c3aed' : '#f1f5f9',
                  color: step >= n ? '#fff' : '#94a3b8',
                  transition: 'background 0.2s',
                }}>
                  {n}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: step === n ? '#374151' : '#94a3b8' }}>{label}</span>
                {i < arr.length - 1 && (
                  <div style={{ height: '1px', width: '1.5rem', background: step > n ? '#7c3aed' : '#e2e8f0', margin: '0 0.25rem' }} />
                )}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Create your account</h1>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.75rem' }}>Free forever. No credit card required.</p>

              <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Full name</label>
                  <div style={{ position: 'relative' }}>{inputIcon(User)}
                    <input type="text" required className="field" placeholder="Jane Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Email address</label>
                  <div style={{ position: 'relative' }}>{inputIcon(Mail)}
                    <input type="email" required autoComplete="email" className="field" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Password</label>
                  <div style={{ position: 'relative' }}>{inputIcon(Lock)}
                    <input type="password" required autoComplete="new-password" className="field" placeholder="Minimum 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>
                    Bio <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={14} style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: '#94a3b8', pointerEvents: 'none' }} />
                    <textarea className="field" rows={2} placeholder="A short description of your background..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '0.25rem' }}>Continue →</button>
              </form>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Your skill areas</h1>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>Select all categories that apply to your work.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '1.75rem' }}>
                {CATEGORIES.map((cat) => {
                  const sel = form.categories.includes(cat.value);
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => toggle(cat.value)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.625rem',
                        padding: '0.75rem 1rem', borderRadius: '0.5rem', textAlign: 'left',
                        border: sel ? '2px solid #7c3aed' : '2px solid #e2e8f0',
                        background: sel ? '#f5f3ff' : '#fff',
                        color: sel ? '#5b21b6' : '#475569',
                        fontWeight: 500, fontSize: '0.8125rem', cursor: 'pointer',
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                    >
                      <CategoryIcon name={cat.icon} size={14} className={sel ? 'text-violet-600' : 'text-slate-400'} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '0.625rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '0.7rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background 0.15s' }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary"
                  style={{ flex: 1, width: 'auto' }}
                >
                  {loading ? 'Creating…' : 'Create account'}
                </button>
              </div>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '1.25rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
