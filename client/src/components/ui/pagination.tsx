import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

function buildPageList(page: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  return [...pages].filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b);
}

const navButtonClasses =
  'inline-flex h-11 w-11 items-center justify-center rounded-md border border-stone-300 bg-white text-stone-600 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9';

export function Pagination({ page, totalPages, total, limit, onChange }: PaginationProps) {
  if (total === 0) {
    return null;
  }

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pages = buildPageList(page, totalPages);

  return (
    <nav
      className="flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-5 sm:flex-row"
      aria-label="Navigasi halaman"
    >
      <p className="text-xs tabular-nums text-stone-500">
        Menampilkan {from}–{to} dari {total} konten
      </p>

      {totalPages > 1 ? (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(page - 1)}
            disabled={page <= 1}
            className={navButtonClasses}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          {pages.map((item, index) => {
            const previous = pages[index - 1];
            const showEllipsis = previous !== undefined && item - previous > 1;

            return (
              <span key={item} className="flex items-center gap-1">
                {showEllipsis ? <span className="px-1 text-stone-400">…</span> : null}
                <button
                  type="button"
                  onClick={() => onChange(item)}
                  aria-current={item === page ? 'page' : undefined}
                  className={`inline-flex h-11 min-w-11 items-center justify-center rounded-md border px-2 text-sm tabular-nums transition-colors sm:h-9 sm:min-w-9 ${
                    item === page
                      ? 'border-stone-900 bg-stone-900 font-medium text-white'
                      : 'border-stone-300 bg-white text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {item}
                </button>
              </span>
            );
          })}

          <button
            type="button"
            onClick={() => onChange(page + 1)}
            disabled={page >= totalPages}
            className={navButtonClasses}
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </nav>
  );
}
