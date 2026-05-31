import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';
import CategoryIcon from '../components/CategoryIcon';
import { useAuth } from '../context/AuthContext';

const steps = [
  { step: '01', title: 'Create your profile',  desc: 'Sign up and select the skill categories that match your expertise.' },
  { step: '02', title: 'Post a listing',        desc: 'Describe what you offer, what you want in return, your level, and time estimate.' },
  { step: '03', title: 'Propose a swap',        desc: 'Browse listings and send a proposal to anyone whose skills you need.' },
  { step: '04', title: 'Deliver and rate',      desc: 'Complete the work, both sides confirm done, then rate each other.' },
];

const trust = [
  'No money changes hands — ever',
  'Both parties agree on scope before work starts',
  'Verified reputation through peer reviews',
  'Cancel or decline any request freely',
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* ── Hero ─────────────────────────── */}
      <section style={{ background: '#0f172a', color: '#fff' }}>
        <div className="section-wrap">
          <div className="inner" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: '1.25rem' }}>
                  Skill Exchange Platform
                </span>
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, color: '#f8fafc', marginBottom: '1.25rem' }}>
                  Trade skills,<br />not dollars.
                </h1>
                <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '28rem' }}>
                  SwapSkill connects professionals who want to exchange expertise directly.
                  No fees. No middlemen. Just pure value.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link to={user ? '/listings/new' : '/register'}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#7c3aed', color: '#fff', fontWeight: 600, padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontSize: '0.9rem' }}>
                    {user ? 'Post a listing' : 'Get started'} <ArrowRight size={16} />
                  </Link>
                  <Link to="/browse"
                    style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent', color: '#cbd5e1', fontWeight: 600, padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', border: '1.5px solid #334155', fontSize: '0.9rem' }}>
                    Browse listings
                  </Link>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {trust.map((p) => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#1e293b', borderRadius: '0.5rem', padding: '0.875rem 1rem' }}>
                    <CheckCircle size={15} style={{ color: '#a78bfa', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <div className="section-wrap">
          <div className="inner">
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.5rem' }}>Process</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '3.5rem' }}>How it works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2.5rem' }}>
              {steps.map(({ step, title, desc }) => (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#e2e8f0', lineHeight: 1 }}>{step}</span>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a' }}>{title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────── */}
      <section style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
        <div className="section-wrap">
          <div className="inner">
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.5rem' }}>Categories</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '2.5rem' }}>Browse by skill area</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              {CATEGORIES.map((cat) => (
                <Link key={cat.value} to={`/browse?category=${cat.value}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem 1.125rem', textDecoration: 'none', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(124,58,237,0.12)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <CategoryIcon name={cat.icon} size={15} className="text-slate-400" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────── */}
      {!user && (
        <section style={{ background: '#fff' }}>
          <div className="section-wrap">
            <div className="inner">
              <div style={{ background: '#7c3aed', borderRadius: '1rem', padding: '4rem 3rem', textAlign: 'center', color: '#fff' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>Ready to start swapping?</h2>
                <p style={{ fontSize: '0.9375rem', color: '#ddd6fe', marginBottom: '2rem', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.65 }}>
                  Join professionals exchanging skills every day. Free to join, free to use.
                </p>
                <Link to="/register"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff', color: '#7c3aed', fontWeight: 700, padding: '0.75rem 1.75rem', borderRadius: '0.5rem', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Create your account <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
