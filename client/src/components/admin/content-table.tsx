import { ImageOff, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../lib/format';
import type { Content } from '../../types/content';
import { buttonClasses } from '../ui/button-styles';
import { GenreLabel, StatusIndicator } from '../ui/meta';

interface ContentTableProps {
  items: Content[];
  onDelete: (content: Content) => void;
}

function MiniThumbnail({ src, alt }: { src: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className="flex h-10 w-16 shrink-0 items-center justify-center rounded-md bg-stone-100 text-stone-400">
        <ImageOff className="h-4 w-4" aria-hidden="true" />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-10 w-16 shrink-0 rounded-md object-cover"
    />
  );
}

function publishedLabel(content: Content): string {
  return content.published_at ? formatDate(content.published_at) : '—';
}

export function ContentTable({ items, onDelete }: ContentTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <ul className="divide-y divide-stone-200 lg:hidden">
        {items.map((content) => (
          <li key={content.id} className="flex flex-col gap-3 p-4">
            <div className="flex items-start gap-3">
              <MiniThumbnail src={content.thumbnail_url} alt={`Thumbnail ${content.title}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-900">{content.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-stone-500">
                  <GenreLabel genre={content.genre} />
                  <span className="tabular-nums">{publishedLabel(content)}</span>
                </p>
              </div>
              <StatusIndicator status={content.status} />
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/admin/contents/${content.id}/edit`} className={buttonClasses('secondary', 'sm', 'flex-1')}>
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                Edit
              </Link>
              <button
                type="button"
                onClick={() => onDelete(content)}
                className={buttonClasses('danger-ghost', 'sm', 'flex-1')}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-[11px] tracking-[0.08em] text-stone-500 uppercase">
              <th scope="col" className="px-5 py-3 font-medium">
                Konten
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Tanggal publish
              </th>
              <th scope="col" className="px-5 py-3 text-right font-medium">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {items.map((content) => (
              <tr key={content.id} className="transition-colors hover:bg-stone-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <MiniThumbnail src={content.thumbnail_url} alt={`Thumbnail ${content.title}`} />
                    <div className="min-w-0">
                      <p className="max-w-md truncate font-medium text-stone-900">{content.title}</p>
                      <p className="mt-0.5">
                        <GenreLabel genre={content.genre} />
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <StatusIndicator status={content.status} />
                </td>
                <td className="px-5 py-3 tabular-nums whitespace-nowrap text-stone-600">{publishedLabel(content)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/admin/contents/${content.id}/edit`} className={buttonClasses('ghost', 'sm')}>
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(content)}
                      className={buttonClasses('danger-ghost', 'sm')}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
