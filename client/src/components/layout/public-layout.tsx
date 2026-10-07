import { Link, NavLink, Outlet } from 'react-router-dom';
import { buttonClasses } from '../ui/button-styles';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/contents" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-900 text-[13px] font-semibold text-white">
              G
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold text-stone-900">Gateplus</span>
              <span className="hidden text-sm text-stone-500 sm:inline">Content</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Navigasi utama">
            <NavLink
              to="/contents"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive ? 'font-medium text-stone-900' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`
              }
            >
              Katalog
            </NavLink>
            <Link to="/admin/contents" className={buttonClasses('secondary', 'sm')}>
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Gateplus Content — dibangun dengan MongoDB, Express, React, dan Node.js.</p>
          <p>Take-home test Web Developer</p>
        </div>
      </footer>
    </div>
  );
}
