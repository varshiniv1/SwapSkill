import { Link } from 'react-router-dom';
import { ArrowRight, Repeat2, Star, Shield, Zap } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const steps = [
  { step: '1', title: 'Sign up & pick skills', desc: 'Choose your skill categories — Dev, Design, Writing, Marketing and more.' },
  { step: '2', title: 'Post a listing', desc: 'Tell the world what you offer and what you want back. Set your level and time estimate.' },
  { step: '3', title: 'Browse & propose', desc: 'Find someone who has what you need. Send them a swap proposal in one click.' },
  { step: '4', title: 'Agree & deliver', desc: 'Settle on scope and deadline, do the work, both mark done, then rate each other.' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Zap size={14} /> Free skill exchange — no money needed
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Trade skills,<br />not dollars
          </h1>
          <p className="text-lg text-violet-100 max-w-xl mx-auto mb-10">
            SwapSkill connects people who want to exchange expertise. You build my website, I write your copy. Zero cost, pure value.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={user ? '/listings/new' : '/register'}
              className="bg-white text-violet-700 font-semibold px-8 py-3 rounded-xl hover:bg-violet-50 transition-colors flex items-center justify-center gap-2"
            >
              {user ? 'Post a listing' : 'Get started free'} <ArrowRight size={18} />
            </Link>
            <Link
              to="/browse"
              className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/20 transition-colors"
            >
              Browse listings
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-3">How it works</h2>
        <p className="text-slate-500 text-center mb-12">Four simple steps to your first skill swap</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ step, title, desc }) => (
            <div key={step} className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {step}
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-3">Browse by category</h2>
          <p className="text-slate-500 text-center mb-10">Whatever skill you need, find it here</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                to={`/browse?category=${cat.value}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 text-center hover:border-violet-300 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <p className="font-medium text-slate-700 group-hover:text-violet-600 transition-colors">{cat.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {[
          { icon: <Repeat2 size={28} className="text-violet-600" />, title: 'Fair exchange', desc: 'Both sides agree on scope before work begins.' },
          { icon: <Star size={28} className="text-amber-400" />, title: 'Reputation system', desc: 'Ratings build trust. Great swappers rise to the top.' },
          { icon: <Shield size={28} className="text-green-500" />, title: 'Always free', desc: 'No fees, no subscriptions, ever.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center gap-3">
            {icon}
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500">{desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      {!user && (
        <section className="bg-violet-600 text-white">
          <div className="max-w-2xl mx-auto px-6 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to swap?</h2>
            <p className="text-violet-100 mb-8">Join a community of makers, builders, and creators exchanging skills every day.</p>
            <Link to="/register" className="bg-white text-violet-700 font-semibold px-8 py-3 rounded-xl hover:bg-violet-50 transition-colors inline-flex items-center gap-2">
              Create your free account <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
