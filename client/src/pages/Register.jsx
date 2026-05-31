import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../utils/constants';
import toast from 'react-hot-toast';
import { Repeat2 } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', bio: '', categories: [] });

  const toggleCategory = (val) =>
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(val)
        ? prev.categories.filter((c) => c !== val)
        : [...prev.categories, val],
    }));

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Fill in all fields');
    if (form.password.length < 6) return toast.error('Password must be 6+ characters');
    setStep(2);
  };

  const handleSubmit = async () => {
    if (form.categories.length === 0) return toast.error('Pick at least one skill category');
    setLoading(true);
    try {
      await register(form);
      toast.success('Welcome to SwapSkill!');
      navigate('/browse');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <Repeat2 size={22} className="text-violet-600" />
          <span className="font-bold text-lg text-violet-600">SwapSkill</span>
        </div>

        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Create your account</h2>
            <p className="text-sm text-slate-500 mb-6">Free forever. No credit card needed.</p>
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Full name</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="6+ characters"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Short bio <span className="text-slate-400">(optional)</span></label>
                <textarea
                  rows={2}
                  className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell others about yourself…"
                />
              </div>
              <button type="submit" className="w-full bg-violet-600 text-white font-semibold py-3 rounded-xl hover:bg-violet-700 transition-colors">
                Continue →
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Pick your skill categories</h2>
            <p className="text-sm text-slate-500 mb-6">Choose all that apply — you can always change this later.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {CATEGORIES.map((cat) => {
                const selected = form.categories.includes(cat.value);
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => toggleCategory(cat.value)}
                    className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                      selected
                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-slate-200 text-slate-600 hover:border-violet-200'
                    }`}
                  >
                    <span className="text-lg">{cat.emoji}</span> {cat.label}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-slate-200 text-slate-600 font-medium py-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-violet-600 text-white font-semibold py-3 rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-60"
              >
                {loading ? 'Creating…' : 'Create account'}
              </button>
            </div>
          </>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
