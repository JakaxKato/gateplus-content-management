export function inputClasses(hasError = false): string {
  return `h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-800 transition placeholder:text-slate-400 focus:ring-2 focus:outline-none ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
  }`;
}

export function textareaClasses(hasError = false): string {
  return `w-full rounded-lg border bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-800 transition placeholder:text-slate-400 focus:ring-2 focus:outline-none ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
  }`;
}

export function selectClasses(hasError = false): string {
  return inputClasses(hasError);
}
