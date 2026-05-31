import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import StarRating from './StarRating';
import CategoryIcon from './CategoryIcon';
import { LEVEL_COLORS, getCategoryMeta } from '../utils/constants';

export default function ListingCard({ listing }) {
  const { _id, title, offerSkill, offerCategory, offerLevel, wantSkills, timeEstimate, user } = listing;
  const cat = getCategoryMeta(offerCategory);

  return (
    <Link
      to={`/listings/${_id}`}
      className="group flex flex-col bg-white rounded-xl border border-slate-200 p-5 hover:border-violet-300 hover:shadow-sm transition-all gap-4"
    >
      {/* Category + level row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <CategoryIcon name={cat.icon} size={13} className="text-slate-400" />
          {cat.label}
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${LEVEL_COLORS[offerLevel]}`}>
          {offerLevel}
        </span>
      </div>

      {/* Title + offer */}
      <div>
        <h3 className="font-semibold text-slate-800 group-hover:text-violet-600 transition-colors line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-xs text-slate-400">
          Offering <span className="font-medium text-slate-600">{offerSkill}</span>
        </p>
      </div>

      {/* Wants */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="text-xs text-slate-400">Wants:</span>
        {wantSkills.slice(0, 3).map((s, i) => (
          <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            {s}
          </span>
        ))}
        {wantSkills.length > 3 && (
          <span className="text-xs text-slate-400">+{wantSkills.length - 3} more</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-semibold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-700">{user?.name}</p>
            <div className="flex items-center gap-1">
              <StarRating rating={user?.rating || 0} size={11} />
              <span className="text-xs text-slate-400">({user?.reviewCount || 0})</span>
            </div>
          </div>
        </div>
        {timeEstimate && (
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={11} />
            {timeEstimate}
          </div>
        )}
      </div>
    </Link>
  );
}
