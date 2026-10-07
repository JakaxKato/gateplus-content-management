export function inputClasses(hasError = false): string {
  return `h-11 w-full rounded-md border bg-white px-3 text-base text-stone-900 transition-colors placeholder:text-stone-400 sm:h-10 sm:text-sm ${
    hasError ? 'border-red-400' : 'border-stone-300 hover:border-stone-400'
  } disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500`;
}

export function textareaClasses(hasError = false): string {
  return `w-full rounded-md border bg-white px-3 py-2.5 text-base leading-relaxed text-stone-900 transition-colors placeholder:text-stone-400 sm:text-sm ${
    hasError ? 'border-red-400' : 'border-stone-300 hover:border-stone-400'
  } disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500`;
}

export function selectClasses(hasError = false): string {
  return inputClasses(hasError);
}
