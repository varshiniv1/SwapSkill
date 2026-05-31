import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import StarRating from './StarRating';
import { LEVEL_COLORS, getCategoryLabel } from '../utils/constants';

export default function ListingCard({ listing }) {
  const { _id, title, offerSkill, offerCategory, offerLevel, wantSkills, timeEstimate, user } = listing;
  const cat = getCategoryLabel(offerCategory);

  return (
    <Link
      to={`/listings/${_id}`}
      className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-violet-200 transition-all flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{cat.emoji}</span>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {cat.label}
          </span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${LEVEL_COLORS[offerLevel]}`}>
          {offerLevel}
        </span>
      </div>

      {/* Title + Offer */}
      <div>
        <h3 className="font-semibold text-slate-800 group-hover:text-violet-600 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Offering: <span className="font-medium text-slate-700">{offerSkill}</span>
        </p>
      </div>

      {/* Wants */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-slate-400">Wants:</span>
        {wantSkills.slice(0, 3).map((s, i) => (
          <span key={i} className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full">
            {s}
          </span>
        ))}
        {wantSkills.length > 3 && (
          <span className="text-xs text-slate-400">+{wantSkills.length - 3}</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-bold">
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
