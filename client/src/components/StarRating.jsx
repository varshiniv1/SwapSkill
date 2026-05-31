import { Star } from 'lucide-react';

export default function StarRating({ rating, size = 16, interactive = false, onChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((s) => (
        <Star
          key={s}
          size={size}
          className={`${
            s <= Math.round(rating)
              ? 'text-amber-400 fill-amber-400'
              : 'text-slate-300 fill-slate-100'
          } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => interactive && onChange && onChange(s)}
        />
      ))}
    </div>
  );
}
