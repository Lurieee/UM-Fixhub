export type Category = {
  key: string;
  label: string;
  description: string;
  icon: string;
  iconName: 'flash-outline' | 'water-outline' | 'chair-rolling' | 'office-building-outline' | 'trash-can-outline' | 'help-circle-outline';
};

export const CATEGORIES: Category[] = [
  { key: 'Electrical', label: 'Electrical', description: 'Lights, outlets, power', icon: '⚡', iconName: 'flash-outline' },
  { key: 'Plumbing', label: 'Plumbing', description: 'Leaks, faucets, toilets', icon: '💧', iconName: 'water-outline' },
  { key: 'Furniture', label: 'Furniture', description: 'Desks, chairs, whiteboards', icon: '🪑', iconName: 'chair-rolling' },
  { key: 'Infrastructure', label: 'Infrastructure', description: 'Walkways, doors, walls', icon: '🏗️', iconName: 'office-building-outline' },
  { key: 'Cleanliness', label: 'Cleanliness', description: 'Spills, overflowing bins', icon: '🗑️', iconName: 'trash-can-outline' },
  { key: 'Other', label: 'Other', description: 'Any different issue', icon: '❓', iconName: 'help-circle-outline' },
];

export function categoryIcon(key: string) {
  return CATEGORIES.find((c) => c.key === key)?.icon ?? '❓';
}

export function categoryIconName(key: string) {
  return CATEGORIES.find((c) => c.key === key)?.iconName ?? 'help-circle-outline';
}
