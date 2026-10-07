import { Search, SlidersHorizontal, X } from 'lucide-react';
import { GENRES } from '../../types/content';

interface ContentFiltersProps {
  search: string;
  genre: string;
  onSearchChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onReset: () => void;
}

export function ContentFilters({ search, genre, onSearchChange, onGenreChange, onReset }: ContentFiltersProps) {
  const hasActiveFilter = search !== '' || genre !== '';
  const fieldClasses =
    'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none';

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-label="Filter konten">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari judul content..."
            aria-label="Cari berdasarkan judul"
            className={`${fieldClasses} pr-9 pl-9`}
          />
          {search !== '' ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Hapus pencarian"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <select
          value={genre}
          onChange={(event) => onGenreChange(event.target.value)}
          aria-label="Filter genre"
          className={fieldClasses}
        >
          <option value="">Semua genre</option>
          {GENRES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilter}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Reset
        </button>
      </div>
    </section>
  );
}
