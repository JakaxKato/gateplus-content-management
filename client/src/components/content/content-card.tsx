import { Link } from 'react-router-dom';
import { formatDate } from '../../lib/format';
import type { Content } from '../../types/content';
import { GenreLabel, MetaSeparator, StatusIndicator } from '../ui/meta';
import { Thumbnail } from '../ui/thumbnail';

export function ContentCard({ content }: { content: Content }) {
  return (
    <Link
      to={`/contents/${content.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-colors hover:border-stone-400"
    >
      <Thumbnail src={content.thumbnail_url} alt={`Thumbnail ${content.title}`} />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <GenreLabel genre={content.genre} />
          <MetaSeparator />
          <span className="text-xs tabular-nums text-stone-500">
            {content.published_at ? formatDate(content.published_at) : 'Belum dipublikasikan'}
          </span>
        </div>

        <h2 className="line-clamp-2 text-[15px] leading-snug font-semibold text-stone-900 underline-offset-2 group-hover:underline">
          {content.title}
        </h2>

        <p className="line-clamp-2 text-sm leading-relaxed text-stone-600">{content.description}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <StatusIndicator status={content.status} />
          <span className="text-xs font-medium text-stone-500 transition-colors group-hover:text-stone-900">
            Lihat detail
          </span>
        </div>
      </div>
    </Link>
  );
}
