import { ArrowLeft, CalendarClock, CalendarDays, RefreshCw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { GenreBadge, StatusBadge } from '../../components/ui/badge';
import { DetailSkeleton, ErrorState } from '../../components/ui/feedback';
import { Thumbnail } from '../../components/ui/thumbnail';
import { useContent } from '../../hooks/use-contents';
import { ApiError } from '../../lib/api';
import { formatDate } from '../../lib/format';

export function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const query = useContent(id);

  if (query.isPending) {
    return <DetailSkeleton />;
  }

  if (query.isError) {
    const isNotFound = query.error instanceof ApiError && query.error.status === 404;

    return (
      <div className="space-y-6">
        <BackLink />
        <ErrorState
          title={isNotFound ? 'Content tidak ditemukan' : 'Gagal memuat content'}
          message={
            isNotFound
              ? 'Content yang Anda cari mungkin sudah dihapus atau belum pernah ada.'
              : query.error instanceof ApiError
                ? query.error.message
                : 'Terjadi kesalahan tak terduga.'
          }
          onRetry={isNotFound ? undefined : () => void query.refetch()}
        />
      </div>
    );
  }

  const content = query.data.data;

  return (
    <article className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <BackLink />
        <Button variant="ghost" size="sm" icon={<RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />} onClick={() => void query.refetch()}>
          Muat ulang
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Thumbnail src={content.thumbnail_url} alt={`Thumbnail ${content.title}`} />
            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <GenreBadge genre={content.genre} />
                <StatusBadge status={content.status} />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{content.title}</h1>
              <p className="text-sm leading-relaxed whitespace-pre-line text-slate-600">{content.description}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Informasi</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-xs font-semibold text-slate-500">Genre</dt>
                <dd className="mt-1 font-semibold text-slate-800">{content.genre}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={content.status} />
                </dd>
              </div>
              <div>
                <dt className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  Tanggal publish
                </dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {content.published_at ? formatDate(content.published_at) : 'Belum dipublikasikan'}
                </dd>
              </div>
              <div>
                <dt className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                  Terakhir diperbarui
                </dt>
                <dd className="mt-1 font-semibold text-slate-800">{formatDate(content.updated_at)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
            <p className="text-sm text-indigo-900">
              Ingin mengubah content ini? Buka panel admin untuk mengedit atau menghapusnya.
            </p>
            <Link to={`/admin/contents/${content.id}/edit`} className="mt-3 inline-flex">
              <Button size="sm" variant="secondary">
                Edit di panel admin
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}

function BackLink() {
  return (
    <Link
      to="/contents"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-indigo-700"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Kembali ke daftar content
    </Link>
  );
}
