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
    if (!form.name.trim() || !form.email.trim() || !form.password)
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
      toast.success('Account created. Welcome!');
      navigate('/browse');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Repeat2 size={22} className="text-violet-600" />
          <span className="font-bold text-lg text-slate-800">SwapSkill</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-8 py-8">

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-7">
            {[
              { n: 1, label: 'Your details'   },
              { n: 2, label: 'Skill areas'    },
            ].map(({ n, label }, i, arr) => (
              <div key={n} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  step >= n ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>{n}</div>
                <span className={`text-xs font-medium ${step === n ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
                {i < arr.length - 1 && (
                  <div className={`h-px w-6 mx-1 rounded ${step > n ? 'bg-violet-500' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-xl font-bold text-slate-900 mb-1">Create your account</h1>
              <p className="text-sm text-slate-500 mb-7">Free forever. No credit card required.</p>

              <form onSubmit={handleStep1} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg
                                 placeholder:text-slate-400 text-slate-900
                                 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg
                                 placeholder:text-slate-400 text-slate-900
                                 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg
                                 placeholder:text-slate-400 text-slate-900
                                 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                      placeholder="Minimum 6 characters"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Bio <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <FileText size={15} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                    <textarea
                      rows={2}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg
                                 placeholder:text-slate-400 text-slate-900 resize-none
                                 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                      placeholder="A short description of your background..."
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-1"
                >
                  Continue →
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-slate-900 mb-1">Your skill areas</h1>
              <p className="text-sm text-slate-500 mb-6">Select all categories that apply to your work.</p>

              <div className="grid grid-cols-2 gap-2.5 mb-7">
                {CATEGORIES.map((cat) => {
                  const selected = form.categories.includes(cat.value);
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => toggleCategory(cat.value)}
                      className={`flex items-center gap-2.5 px-3.5 py-3 rounded-lg border-2 text-sm font-medium transition-all text-left ${
                        selected
                          ? 'border-violet-500 bg-violet-50 text-violet-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <CategoryIcon
                        name={cat.icon}
                        size={15}
                        className={selected ? 'text-violet-600 shrink-0' : 'text-slate-400 shrink-0'}
                      />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-slate-300 text-slate-600 font-medium py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-2 flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60
                             text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          {step === 1 ? 'Already have an account? ' : ''}
          {step === 1 && (
            <Link to="/login" className="text-violet-600 font-semibold hover:underline">
              Sign in
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}
