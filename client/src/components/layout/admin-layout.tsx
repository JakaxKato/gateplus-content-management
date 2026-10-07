import { LogOut, Plus } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to="/admin/contents" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-extrabold text-white">
                G
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-bold text-white">Gateplus</span>
                <span className="block text-xs text-slate-400">Admin Panel</span>
              </span>
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              <NavLink
                to="/admin/contents"
                end
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                Content
              </NavLink>
              <Link
                to="/"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Lihat halaman publik
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/contents/new"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Tambah Content</span>
            </Link>
            <div className="hidden items-center gap-3 border-l border-slate-700 pl-3 md:flex">
              <span className="text-xs text-slate-300">{user?.email}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 text-xs text-slate-500 sm:px-6">
          Panel admin — perubahan langsung tersimpan ke database melalui REST API.
        </div>
      </footer>
    </div>
  );
}
