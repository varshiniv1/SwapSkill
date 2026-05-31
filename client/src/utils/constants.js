export const CATEGORIES = [
  { value: 'dev',       label: 'Development',  icon: 'Code2'      },
  { value: 'design',    label: 'Design',        icon: 'Palette'    },
  { value: 'writing',   label: 'Writing',       icon: 'PenLine'    },
  { value: 'marketing', label: 'Marketing',     icon: 'Megaphone'  },
  { value: 'video',     label: 'Video & Audio', icon: 'Video'      },
  { value: 'data',      label: 'Data & AI',     icon: 'BarChart2'  },
  { value: 'business',  label: 'Business',      icon: 'Briefcase'  },
  { value: 'other',     label: 'Other',         icon: 'Layers'     },
];

export const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'mid',      label: 'Mid-level' },
  { value: 'expert',   label: 'Expert'   },
];

export const LEVEL_COLORS = {
  beginner: 'bg-emerald-50 text-emerald-700',
  mid:      'bg-blue-50   text-blue-700',
  expert:   'bg-violet-50 text-violet-700',
};

export const STATUS_COLORS = {
  pending:   'bg-amber-50   text-amber-700',
  accepted:  'bg-blue-50    text-blue-700',
  countered: 'bg-orange-50  text-orange-700',
  declined:  'bg-red-50     text-red-600',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-slate-100  text-slate-500',
};

export const getCategoryMeta = (val) =>
  CATEGORIES.find((c) => c.value === val) || { label: val, icon: 'Layers' };
