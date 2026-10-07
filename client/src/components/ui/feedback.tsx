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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <SearchX className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-base font-bold text-slate-900">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/60 px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-base font-bold text-red-900">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-red-700">{message}</p>
      {onRetry ? (
        <Button variant="secondary" className="mt-5" onClick={onRetry}>
          Coba lagi
        </Button>
      ) : null}
    </div>
  );
}

export function ContentCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="aspect-video w-full animate-pulse bg-slate-200" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-20 animate-pulse rounded-full bg-slate-200" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function ContentGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <ContentCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-32 rounded bg-slate-200" />
      <div className="aspect-video w-full rounded-2xl bg-slate-200" />
      <div className="space-y-3">
        <div className="h-7 w-2/3 rounded bg-slate-200" />
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-5/6 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-14 w-full animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}
