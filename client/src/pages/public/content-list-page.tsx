import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ContentCard } from '../../components/content/content-card';
import { ContentFilters } from '../../components/content/content-filters';
import { Button } from '../../components/ui/button';
import { ContentGridSkeleton, EmptyState, ErrorState } from '../../components/ui/feedback';
import { Pagination } from '../../components/ui/pagination';
import { useContents } from '../../hooks/use-contents';
import { useDebounce } from '../../hooks/use-debounce';
import { ApiError } from '../../lib/api';

const PAGE_SIZE = 9;

export function ContentListPage() {
  const [searchInput, setSearchInput] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);

  const search = useDebounce(searchInput, 400).trim();
  const query = useContents({ search, genre, status: 'published', page, limit: PAGE_SIZE });

  const items = query.data?.data ?? [];
  const meta = query.data?.meta;
  const isFiltering = searchInput !== '' || genre !== '';

  const resetFilters = () => {
    setSearchInput('');
    setGenre('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-[28px]">Katalog konten</h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Jelajahi dan baca konten terbaru Gateplus. Halaman ini hanya menampilkan konten berstatus published.
        </p>
      </header>

      <ContentFilters
        search={searchInput}
        genre={genre}
        onSearchChange={(value) => {
          setSearchInput(value);
          setPage(1);
        }}
        onGenreChange={(value) => {
          setGenre(value);
          setPage(1);
        }}
        onReset={resetFilters}
      />

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs tabular-nums text-stone-500">
          {meta ? `Menampilkan ${items.length} dari ${meta.total} konten` : 'Memuat konten...'}
        </p>
        {query.isFetching && !query.isPending ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Memperbarui
          </span>
        ) : null}
      </div>

      {query.isPending ? (
        <ContentGridSkeleton count={PAGE_SIZE} />
      ) : query.isError ? (
        <ErrorState
          title="Gagal memuat konten"
          message={query.error instanceof ApiError ? query.error.message : 'Terjadi kesalahan tak terduga.'}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="Konten tidak ditemukan"
          description={
            isFiltering
              ? 'Tidak ada konten yang cocok dengan pencarian atau filter yang dipilih.'
              : 'Belum ada konten yang tersedia saat ini.'
          }
          action={
            isFiltering ? (
              <Button variant="secondary" size="sm" onClick={resetFilters}>
                Reset filter
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {items.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      )}

      {meta ? (
        <Pagination
          page={meta.page}
          totalPages={meta.total_pages}
          total={meta.total}
          limit={meta.limit}
          onChange={setPage}
        />
      ) : null}
    </div>
  );
}
