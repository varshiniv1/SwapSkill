import {
  Code2, Palette, PenLine, Megaphone,
  Video, BarChart2, Briefcase, Layers,
} from 'lucide-react';

const icons = { Code2, Palette, PenLine, Megaphone, Video, BarChart2, Briefcase, Layers };

export default function CategoryIcon({ name, size = 16, className = '' }) {
  const Icon = icons[name] || Layers;
  return <Icon size={size} className={className} />;
}
