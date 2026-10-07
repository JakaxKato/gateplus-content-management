import type { ContentStatus } from '../../types/content';

const STATUS_META: Record<ContentStatus, { label: string; dot: string }> = {
  published: { label: 'Published', dot: 'bg-emerald-600' },
  draft: { label: 'Draft', dot: 'bg-stone-400' },
};

export function StatusIndicator({ status }: { status: ContentStatus }) {
  const meta = STATUS_META[status];

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-stone-600">
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function GenreLabel({ genre }: { genre: string }) {
  return <span className="text-[11px] font-medium tracking-[0.08em] text-stone-500 uppercase">{genre}</span>;
}

export function MetaSeparator() {
  return (
    <span className="text-stone-300" aria-hidden="true">
      ·
    </span>
  );
}
