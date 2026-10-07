import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../lib/format';
import type { Content } from '../../types/content';
import { GenreBadge, StatusBadge } from '../ui/badge';
import { Thumbnail } from '../ui/thumbnail';

export function ContentCard({ content }: { content: Content }) {
  return (
    <Link
      to={`/contents/${content.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/60"
    >
      <Thumbnail src={content.thumbnail_url} alt={`Thumbnail ${content.title}`} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <GenreBadge genre={content.genre} />
          <StatusBadge status={content.status} />
        </div>

        <h2 className="line-clamp-2 text-base font-bold text-slate-900 transition group-hover:text-indigo-700">
          {content.title}
        </h2>

        <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">{content.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {content.published_at ? formatDate(content.published_at) : 'Belum dipublikasikan'}
          </span>
          <span className="font-semibold text-indigo-600">Lihat detail</span>
        </div>
      </div>
    </Link>
  );
}
