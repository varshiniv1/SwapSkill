import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../utils/constants';
import CategoryIcon from '../components/CategoryIcon';
import toast from 'react-hot-toast';
import { Repeat2 } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', bio: '', categories: [],
  });

  const toggleCategory = (val) =>
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(val)
        ? prev.categories.filter((c) => c !== val)
        : [...prev.categories, val],
    }));

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return toast.error('Please fill in all required fields.');
    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters.');
    setStep(2);
  };

  const handleSubmit = async () => {
    if (form.categories.length === 0)
      return toast.error('Select at least one skill category.');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created.');
      navigate('/browse');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm w-full max-w-md p-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <Repeat2 size={20} className="text-violet-600" />
          <span className="font-bold text-violet-600">SwapSkill</span>
        </Link>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                step >= s ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {s}
              </div>
              {s < 2 && <div className={`h-px w-8 transition-colors ${step > s ? 'bg-violet-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
          <span className="text-xs text-slate-400 ml-2">
            {step === 1 ? 'Account details' : 'Skill categories'}
          </span>
        </div>

        {step === 1 ? (
          <>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Create your account</h2>
            <p className="text-sm text-slate-500 mb-6">Free forever. No credit card required.</p>
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bio <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                  placeholder="A short description of your background..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-violet-600 text-white font-semibold py-2.5 rounded-lg hover:bg-violet-700 transition-colors"
              >
                Continue
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Your skill areas</h2>
            <p className="text-sm text-slate-500 mb-6">Select all categories that apply to your expertise.</p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {CATEGORIES.map((cat) => {
                const selected = form.categories.includes(cat.value);
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => toggleCategory(cat.value)}
                    className={`flex items-center gap-2.5 rounded-lg border-2 px-3.5 py-2.5 text-sm font-medium transition-all ${
                      selected
                        ? 'border-violet-500 bg-violet-50 text-violet-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <CategoryIcon
                      name={cat.icon}
                      size={14}
                      className={selected ? 'text-violet-600' : 'text-slate-400'}
                    />
                    {cat.label}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-slate-200 text-slate-600 font-medium py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-violet-600 text-white font-semibold py-2.5 rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create account'}
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
