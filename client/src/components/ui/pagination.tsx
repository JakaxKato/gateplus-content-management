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

export function Pagination({ page, totalPages, total, limit, onChange }: PaginationProps) {
  if (total === 0) {
    return null;
  }

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pages = buildPageList(page, totalPages);

  return (
    <nav
      className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row"
      aria-label="Navigasi halaman"
    >
      <p className="text-sm text-slate-500">
        Menampilkan <span className="font-semibold text-slate-700">{from}</span>–
        <span className="font-semibold text-slate-700">{to}</span> dari{' '}
        <span className="font-semibold text-slate-700">{total}</span> content
      </p>

      {totalPages > 1 ? (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(page - 1)}
            disabled={page <= 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          {pages.map((item, index) => {
            const previous = pages[index - 1];
            const showEllipsis = previous !== undefined && item - previous > 1;

            return (
              <span key={item} className="flex items-center gap-1">
                {showEllipsis ? <span className="px-1 text-slate-400">…</span> : null}
                <button
                  type="button"
                  onClick={() => onChange(item)}
                  aria-current={item === page ? 'page' : undefined}
                  className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-semibold transition ${
                    item === page
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </nav>
  );
}
