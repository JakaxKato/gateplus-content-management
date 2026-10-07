import { Search, X } from 'lucide-react';
import { GENRES } from '../../types/content';
import { buttonClasses } from '../ui/button-styles';
import { inputClasses, selectClasses } from '../ui/input-styles';

interface ContentFiltersProps {
  search: string;
  genre: string;
  onSearchChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onReset: () => void;
}

export function ContentFilters({ search, genre, onSearchChange, onGenreChange, onReset }: ContentFiltersProps) {
  const hasActiveFilter = search !== '' || genre !== '';

  return (
    <section className="flex flex-col gap-2 sm:flex-row sm:items-center" aria-label="Filter konten">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari konten berdasarkan judul"
          aria-label="Cari konten berdasarkan judul"
          className={`${inputClasses()} pr-10 pl-9`}
        />
        {search !== '' ? (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Hapus pencarian"
            className="absolute top-1/2 right-1.5 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <select
        value={genre}
        onChange={(event) => onGenreChange(event.target.value)}
        aria-label="Filter berdasarkan genre"
        className={`${selectClasses()} sm:w-48`}
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
        className={buttonClasses('ghost', 'md', 'self-start sm:self-auto')}
      >
        Reset filter
      </button>
    </section>
  );
}
