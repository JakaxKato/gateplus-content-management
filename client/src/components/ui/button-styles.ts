export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost' | 'inverse';
export type ButtonSize = 'sm' | 'md';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-stone-900 text-white hover:bg-stone-800',
  secondary: 'border border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-100',
  ghost: 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
  danger: 'bg-red-700 text-white hover:bg-red-800',
  'danger-ghost': 'border border-stone-300 bg-white text-red-700 hover:border-red-300 hover:bg-red-50',
  inverse: 'bg-white text-stone-900 hover:bg-stone-200',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-11 px-3 text-[13px] sm:h-8',
  md: 'h-11 px-4 text-sm sm:h-10',
};

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className = ''): string {
  return `inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;
}
