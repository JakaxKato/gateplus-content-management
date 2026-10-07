import type { ContentStatus } from '../../types/content';

const STATUS_CLASSES: Record<ContentStatus, string> = {
  published: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  draft: 'bg-amber-50 text-amber-700 ring-amber-200',
};

const STATUS_LABELS: Record<ContentStatus, string> = {
  published: 'Published',
  draft: 'Draft',
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_CLASSES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}

export function GenreBadge({ genre }: { genre: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100 ring-inset">
      {genre}
    </span>
  );
}
