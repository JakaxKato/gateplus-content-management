import { LayoutDashboard } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/contents" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-extrabold text-white">
              G
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold text-slate-900">Gateplus</span>
              <span className="block text-xs text-slate-500">Content Hub</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/contents"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              Konten
            </NavLink>
            <Link
              to="/admin/contents"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6">
          <p>Gateplus Content — take-home test Web Developer.</p>
          <p>Dibangun dengan MongoDB, Express, React, Node.js + TypeScript.</p>
        </div>
      </footer>
    </div>
  );
}
