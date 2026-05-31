export const CATEGORIES = [
  { value: 'dev', label: 'Development', emoji: '💻' },
  { value: 'design', label: 'Design', emoji: '🎨' },
  { value: 'writing', label: 'Writing', emoji: '✍️' },
  { value: 'marketing', label: 'Marketing', emoji: '📣' },
  { value: 'video', label: 'Video & Audio', emoji: '🎬' },
  { value: 'data', label: 'Data & AI', emoji: '📊' },
  { value: 'business', label: 'Business', emoji: '💼' },
  { value: 'other', label: 'Other', emoji: '🌟' },
];

export const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'mid', label: 'Mid-level' },
  { value: 'expert', label: 'Expert' },
];

export const LEVEL_COLORS = {
  beginner: 'bg-green-100 text-green-700',
  mid: 'bg-blue-100 text-blue-700',
  expert: 'bg-purple-100 text-purple-700',
};

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  countered: 'bg-orange-100 text-orange-700',
  declined: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

export const getCategoryLabel = (val) =>
  CATEGORIES.find((c) => c.value === val) || { label: val, emoji: '🌟' };
