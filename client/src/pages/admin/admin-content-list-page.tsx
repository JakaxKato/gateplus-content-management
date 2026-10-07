import { Loader2, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminPageHeader } from '../../components/admin/admin-page-header';
import { ContentTable } from '../../components/admin/content-table';
import { DeleteContentDialog } from '../../components/admin/delete-content-dialog';
import { Button } from '../../components/ui/button';
import { EmptyState, ErrorState, TableSkeleton } from '../../components/ui/feedback';
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
        title="Kelola Content"
        description="Semua content tersimpan di database dan dapat diubah kapan saja."
        action={
          <Link to="/admin/contents/new">
            <Button icon={<Plus className="h-4 w-4" aria-hidden="true" />}>Tambah Content</Button>
          </Link>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_200px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
              setPage(1);
            }}
            placeholder="Cari judul content..."
            aria-label="Cari content"
            className="h-11 w-full rounded-lg border border-slate-300 bg-white pr-9 pl-9 text-sm text-slate-700 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
          />
          {searchInput !== '' ? (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setPage(1);
              }}
              aria-label="Hapus pencarian"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
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
          aria-label="Filter status"
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
        >
          <option value="">Semua status</option>
          {CONTENT_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item === 'draft' ? 'Draft' : 'Published'}
            </option>
          ))}
        </select>

        <Button variant="secondary" onClick={resetFilters} disabled={!isFiltering} className="h-11">
          Reset filter
        </Button>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {meta ? (
            <>
              <span className="font-semibold text-slate-700">{meta.total}</span> content ditemukan
            </>
          ) : (
            'Memuat data...'
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
        <TableSkeleton rows={PAGE_SIZE} />
      ) : query.isError ? (
        <ErrorState
          title="Gagal memuat data"
          message={query.error instanceof ApiError ? query.error.message : 'Terjadi kesalahan tak terduga.'}
          onRetry={() => void query.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="Belum ada content"
          description={
            isFiltering
              ? 'Tidak ada content yang cocok dengan filter. Coba reset filter.'
              : 'Mulai dengan membuat content pertama Anda.'
          }
          action={
            isFiltering ? (
              <Button variant="secondary" onClick={resetFilters}>
                Reset filter
              </Button>
            ) : (
              <Link to="/admin/contents/new">
                <Button icon={<Plus className="h-4 w-4" aria-hidden="true" />}>Tambah Content</Button>
              </Link>
            )
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
