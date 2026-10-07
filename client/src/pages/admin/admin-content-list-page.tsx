import { Loader2, Search, X } from 'lucide-react';
import { useState } from 'react';
import { AdminPageHeader } from '../../components/admin/admin-page-header';
import { ContentTable } from '../../components/admin/content-table';
import { DeleteContentDialog } from '../../components/admin/delete-content-dialog';
import { Button } from '../../components/ui/button';
import { EmptyState, ErrorState, TableSkeleton } from '../../components/ui/feedback';
import { inputClasses, selectClasses } from '../../components/ui/input-styles';
import { Pagination } from '../../components/ui/pagination';
import { useContents } from '../../hooks/use-contents';
import { useDebounce } from '../../hooks/use-debounce';
import { ApiError } from '../../lib/api';
import { CONTENT_STATUSES, type Content } from '../../types/content';

const PAGE_SIZE = 10;

export function AdminContentListPage() {
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);

  const search = useDebounce(searchInput, 400).trim();
  const query = useContents({ search, status, page, limit: PAGE_SIZE });

  const items = query.data?.data ?? [];
  const meta = query.data?.meta;
  const isFiltering = searchInput !== '' || status !== '';

  const resetFilters = () => {
    setSearchInput('');
    setStatus('');
    setPage(1);
  };

  return (
    <div>
      <AdminPageHeader
        title="Kelola konten"
        description="Semua konten tersimpan di database. Perubahan langsung tersimpan setelah disimpan."
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
              setPage(1);
            }}
            placeholder="Cari konten berdasarkan judul"
            aria-label="Cari konten berdasarkan judul"
            className={`${inputClasses()} pr-10 pl-9`}
          />
          {searchInput !== '' ? (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setPage(1);
              }}
              aria-label="Hapus pencarian"
              className="absolute top-1/2 right-1.5 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          aria-label="Filter berdasarkan status"
          className={`${selectClasses()} sm:w-44`}
        >
          <option value="">Semua status</option>
          {CONTENT_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item === 'draft' ? 'Draft' : 'Published'}
            </option>
          ))}
        </select>

        <Button variant="ghost" onClick={resetFilters} disabled={!isFiltering}>
          Reset filter
        </Button>
      </div>

      <div className="mt-4 mb-3 flex items-center justify-between gap-3">
        <p className="text-xs tabular-nums text-stone-500">
          {meta ? `${meta.total} konten` : 'Memuat data...'}
        </p>
        {query.isFetching && !query.isPending ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Memperbarui
          </span>
        ) : null}
      </div>

      {query.isPending ? (
        <TableSkeleton rows={PAGE_SIZE} />
      ) : query.isError ? (
        <ErrorState
          title="Gagal memuat data"
          message={query.error instanceof ApiError ? query.error.message : 'Terjadi kesalahan tak terduga.'}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="Belum ada konten"
          description={
            isFiltering
              ? 'Tidak ada konten yang cocok dengan filter yang dipilih.'
              : 'Mulai dengan membuat konten pertama Anda.'
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
        <ContentTable items={items} onDelete={setContentToDelete} />
      )}

      {meta ? (
        <div className="mt-6">
          <Pagination
            page={meta.page}
            totalPages={meta.total_pages}
            total={meta.total}
            limit={meta.limit}
            onChange={setPage}
          />
        </div>
      ) : null}

      <DeleteContentDialog content={contentToDelete} onClose={() => setContentToDelete(null)} />
    </div>
  );
}
