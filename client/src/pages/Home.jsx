import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';
import CategoryIcon from '../components/CategoryIcon';
import { useAuth } from '../context/AuthContext';

const steps = [
  {
    step: '01',
    title: 'Create your profile',
    desc: 'Sign up and select the skill categories that match your expertise.',
  },
  {
    step: '02',
    title: 'Post a listing',
    desc: 'Describe what you offer, what you want in return, your level, and time estimate.',
  },
  {
    step: '03',
    title: 'Propose a swap',
    desc: 'Browse listings and send a proposal to anyone whose skills you need.',
  },
  {
    step: '04',
    title: 'Deliver and rate',
    desc: 'Agree on scope and deadline, complete the work, and build your reputation.',
  },
];

const trustPoints = [
  'No money changes hands — ever',
  'Both parties agree on scope before work starts',
  'Verified reputation through peer reviews',
  'Cancel or decline any request freely',
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-violet-400 mb-4">
              Skill Exchange Platform
            </span>
            <h1 className="text-5xl font-bold leading-tight text-white mb-5">
              Trade skills,<br />not dollars.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              SwapSkill connects professionals who want to exchange expertise directly.
              No fees. No middlemen. Just pure value.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={user ? '/listings/new' : '/register'}
                className="inline-flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-violet-500 transition-colors"
              >
                {user ? 'Post a listing' : 'Get started'} <ArrowRight size={16} />
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center justify-center bg-slate-800 border border-slate-700 text-slate-300 font-semibold px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Browse listings
              </Link>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-3">
            {trustPoints.map((p) => (
              <div key={p} className="flex items-center gap-3 bg-slate-800 rounded-lg px-4 py-3">
                <CheckCircle size={16} className="text-violet-400 shrink-0" />
                <span className="text-sm text-slate-300">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20 w-full">
        <p className="text-xs font-semibold tracking-widest uppercase text-violet-600 mb-2">Process</p>
        <h2 className="text-3xl font-bold text-slate-800 mb-12">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col gap-4">
              <span className="text-4xl font-bold text-slate-100">{step}</span>
              <h3 className="font-semibold text-slate-800">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-violet-600 mb-2">Categories</p>
          <h2 className="text-3xl font-bold text-slate-800 mb-10">Browse by skill area</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                to={`/browse?category=${cat.value}`}
                className="group flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-4 py-3.5 hover:border-violet-300 hover:shadow-sm transition-all"
              >
                <CategoryIcon name={cat.icon} size={16} className="text-slate-400 group-hover:text-violet-500 transition-colors" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-violet-600 transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="max-w-5xl mx-auto px-6 py-20 w-full">
          <div className="bg-violet-600 rounded-2xl px-8 py-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-3">Ready to start swapping?</h2>
            <p className="text-violet-200 mb-8 max-w-md mx-auto">
              Join professionals exchanging skills every day. Free to join, free to use.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-violet-700 font-semibold px-6 py-3 rounded-lg hover:bg-violet-50 transition-colors"
            >
              Create your account <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
