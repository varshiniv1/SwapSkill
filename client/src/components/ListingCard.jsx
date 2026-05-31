import { Link } from 'react-router-dom';
import { Clock, ArrowUpRight } from 'lucide-react';
import StarRating from './StarRating';
import CategoryIcon from './CategoryIcon';
import { getCategoryMeta } from '../utils/constants';

const levelStyle = {
  beginner: { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
  mid:      { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' },
  expert:   { background: '#faf5ff', color: '#6d28d9', border: '1px solid #ddd6fe' },
};

export default function ListingCard({ listing }) {
  const { _id, title, offerSkill, offerCategory, offerLevel, wantSkills, timeEstimate, user } = listing;
  const cat = getCategoryMeta(offerCategory);

  return (
    <Link to={`/listings/${_id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: '#fff', borderRadius: '0.875rem', border: '1px solid #e2e8f0',
        padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem',
        transition: 'box-shadow 0.15s, border-color 0.15s', cursor: 'pointer',
        height: '100%',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.1)'; e.currentTarget.style.borderColor = '#c4b5fd'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
      >
        {/* Top row: category + level */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>
            <CategoryIcon name={cat.icon} size={13} className="text-slate-400" />
            {cat.label}
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize', padding: '0.2rem 0.6rem', borderRadius: '9999px', ...levelStyle[offerLevel] }}>
            {offerLevel}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '0.375rem' }}>
            {title}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Offering <span style={{ fontWeight: 600, color: '#374151' }}>{offerSkill}</span>
          </p>
        </div>

        {/* Wants */}
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '0.375rem' }}>Wants in return</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {wantSkills.slice(0, 3).map((s, i) => (
              <span key={i} style={{ fontSize: '0.75rem', fontWeight: 500, background: '#f5f3ff', color: '#5b21b6', padding: '0.2rem 0.6rem', borderRadius: '9999px', border: '1px solid #ede9fe' }}>
                {s}
              </span>
            ))}
            {wantSkills.length > 3 && (
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>+{wantSkills.length - 3}</span>
            )}
          </div>
        </div>

        {/* Footer: user + time */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#5b21b6', flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', lineHeight: 1.2 }}>{user?.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <StarRating rating={user?.rating || 0} size={11} />
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>({user?.reviewCount || 0})</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {timeEstimate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                <Clock size={11} /> {timeEstimate}
              </div>
            )}
            <ArrowUpRight size={15} style={{ color: '#c4b5fd' }} />
          </div>
        </div>
      </div>
    </Link>
  );
}
