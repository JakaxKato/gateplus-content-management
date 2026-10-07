import { AlertTriangle, SearchX } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './button';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white px-6 py-14 text-center">
      <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900">
        <SearchX className="h-4 w-4 text-stone-400" aria-hidden="true" />
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-stone-600">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Terjadi kesalahan', message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50/60 px-6 py-12 text-center">
      <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-red-900">
        <AlertTriangle className="h-4 w-4 text-red-600" aria-hidden="true" />
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-red-800">{message}</p>
      {onRetry ? (
        <div className="mt-5 flex justify-center">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Coba lagi
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function ContentCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <div className="aspect-video w-full animate-pulse bg-stone-100" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-stone-100" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-stone-100" />
        <div className="h-3 w-full animate-pulse rounded bg-stone-100" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-stone-100" />
      </div>
    </div>
  );
}

export function ContentGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {Array.from({ length: count }, (_, index) => (
        <ContentCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-36 rounded bg-stone-200" />
      <div className="h-6 w-2/3 rounded bg-stone-200" />
      <div className="aspect-video w-full rounded-lg bg-stone-200" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-stone-200" />
        <div className="h-4 w-5/6 rounded bg-stone-200" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-14 w-full animate-pulse rounded-md bg-stone-100" />
      ))}
    </div>
  );
}
