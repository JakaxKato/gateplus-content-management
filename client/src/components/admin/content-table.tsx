import { ImageOff, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../lib/format';
import type { Content } from '../../types/content';
import { GenreBadge, StatusBadge } from '../ui/badge';

interface ContentTableProps {
  items: Content[];
  onDelete: (content: Content) => void;
}

function MiniThumbnail({ src, alt }: { src: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className="flex h-10 w-16 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
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

export function ContentTable({ items, onDelete }: ContentTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <ul className="divide-y divide-slate-100 md:hidden">
        {items.map((content) => (
          <li key={content.id} className="space-y-3 p-4">
            <div className="flex items-start gap-3">
              <MiniThumbnail src={content.thumbnail_url} alt={`Thumbnail ${content.title}`} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{content.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{content.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <GenreBadge genre={content.genre} />
              <StatusBadge status={content.status} />
              <span className="text-xs text-slate-500">
                {content.published_at ? formatDate(content.published_at) : 'Belum dipublikasikan'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/admin/contents/${content.id}/edit`}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                Edit
              </Link>
              <button
                type="button"
                onClick={() => onDelete(content)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 sm:px-5">
                Content
              </th>
              <th scope="col" className="px-4 py-3">
                Genre
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3">
                Tanggal publish
              </th>
              <th scope="col" className="px-4 py-3 text-right sm:px-5">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((content) => (
              <tr key={content.id} className="transition hover:bg-slate-50/70">
                <td className="max-w-xs px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-3">
                    <MiniThumbnail src={content.thumbnail_url} alt={`Thumbnail ${content.title}`} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{content.title}</p>
                      <p className="truncate text-xs text-slate-500">{content.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <GenreBadge genre={content.genre} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={content.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                  {content.published_at ? formatDate(content.published_at) : <span className="text-slate-400">-</span>}
                </td>
                <td className="px-4 py-3 sm:px-5">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/contents/${content.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(content)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
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
