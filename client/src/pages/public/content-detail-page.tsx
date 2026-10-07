import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { buttonClasses } from '../../components/ui/button-styles';
import { DetailSkeleton, ErrorState } from '../../components/ui/feedback';
import { GenreLabel, MetaSeparator, StatusIndicator } from '../../components/ui/meta';
import { Thumbnail } from '../../components/ui/thumbnail';
import { sectionLabel } from '../../components/ui/tokens';
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
          title={isNotFound ? 'Konten tidak ditemukan' : 'Gagal memuat konten'}
          message={
            isNotFound
              ? 'Konten ini mungkin sudah dihapus, belum dipublikasikan, atau tautannya salah.'
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void query.refetch()}
          icon={<RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />}
        >
          Muat ulang
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-5">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <GenreLabel genre={content.genre} />
              <MetaSeparator />
              <StatusIndicator status={content.status} />
              <MetaSeparator />
              <span className="text-xs tabular-nums text-stone-500">
                {content.published_at ? formatDate(content.published_at) : 'Belum dipublikasikan'}
              </span>
            </div>
            <h1 className="text-2xl leading-tight font-semibold tracking-tight text-stone-900 sm:text-[28px]">
              {content.title}
            </h1>
          </header>

          <Thumbnail
            src={content.thumbnail_url}
            alt={`Thumbnail ${content.title}`}
            className="rounded-lg border border-stone-200"
          />

          <section className="max-w-[68ch] space-y-2 pt-1">
            <h2 className={sectionLabel}>Deskripsi</h2>
            <p className="text-[15px] leading-[1.7] whitespace-pre-line text-stone-700">{content.description}</p>
          </section>
        </div>

        <aside className="space-y-6 lg:border-l lg:border-stone-200 lg:pl-6">
          <section>
            <h2 className={sectionLabel}>Informasi</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-stone-500">Genre</dt>
                <dd className="mt-0.5 font-medium text-stone-800">{content.genre}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Status</dt>
                <dd className="mt-1">
                  <StatusIndicator status={content.status} />
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Tanggal publish</dt>
                <dd className="mt-0.5 tabular-nums text-stone-800">{formatDate(content.published_at)}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Terakhir diperbarui</dt>
                <dd className="mt-0.5 tabular-nums text-stone-800">{formatDate(content.updated_at)}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className={sectionLabel}>Kelola</h2>
            <Link to={`/admin/contents/${content.id}/edit`} className={buttonClasses('secondary', 'sm', 'mt-3')}>
              Edit di panel admin
            </Link>
          </section>
        </aside>
      </div>
    </article>
  );
}

function BackLink() {
  return (
    <Link
      to="/contents"
      className="inline-flex items-center gap-1.5 rounded-md text-sm text-stone-600 transition-colors hover:text-stone-900"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Kembali ke katalog
    </Link>
  );
}
