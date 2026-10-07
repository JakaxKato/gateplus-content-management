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
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const search = useDebounce(searchInput, 400).trim();
  const query = useContents({ search, genre, status, page, limit: PAGE_SIZE });

  const items = query.data?.data ?? [];
  const meta = query.data?.meta;
  const isFiltering = searchInput !== '' || genre !== '' || status !== '';

  const resetFilters = () => {
    setSearchInput('');
    setGenre('');
    setStatus('');
    setPage(1);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <section>
        <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Katalog Content</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Jelajahi konten terbaru
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Cari berdasarkan judul, filter berdasarkan genre atau status, lalu buka detail content. Seluruh data diambil
          dari REST API dengan pagination.
        </p>
      </section>

      <ContentFilters
        search={searchInput}
        genre={genre}
        status={status}
        onSearchChange={(value) => {
          setSearchInput(value);
          setPage(1);
        }}
        onGenreChange={(value) => {
          setGenre(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onReset={resetFilters}
      />

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {meta ? (
            <>
              Menampilkan <span className="font-semibold text-slate-700">{items.length}</span> dari{' '}
              <span className="font-semibold text-slate-700">{meta.total}</span> content
            </>
          ) : (
            'Memuat content...'
          )}
        </p>
        {query.isFetching && !query.isPending ? (
          <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Memperbarui...
          </span>
        ) : null}
      </div>

      {query.isPending ? (
        <ContentGridSkeleton count={PAGE_SIZE} />
      ) : query.isError ? (
        <ErrorState
          title="Gagal memuat content"
          message={query.error instanceof ApiError ? query.error.message : 'Terjadi kesalahan tak terduga.'}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="Content tidak ditemukan"
          description={
            isFiltering
              ? 'Tidak ada content yang cocok dengan pencarian atau filter yang dipilih.'
              : 'Belum ada content yang tersedia saat ini.'
          }
          action={
            isFiltering ? (
              <Button variant="secondary" onClick={resetFilters}>
                Reset filter
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
