import { LogOut, Plus } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { buttonClasses } from '../ui/button-styles';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-100">
      <header className="border-b border-stone-800 bg-stone-900">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/admin/contents" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[13px] font-semibold text-stone-900">
              G
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold text-white">Gateplus</span>
              <span className="text-sm text-stone-400">Admin</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/contents"
              className="hidden rounded-md px-2 py-1.5 text-[13px] text-stone-300 transition-colors hover:text-white sm:inline-flex"
            >
              Lihat katalog
            </Link>
            <span className="hidden text-xs text-stone-500 md:block">{user?.email}</span>
            <Link to="/admin/contents/new" className={buttonClasses('inverse', 'sm')}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tambah<span className="hidden sm:inline"> konten</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-11 items-center gap-2 rounded-md px-3 text-[13px] text-stone-300 transition-colors hover:bg-stone-800 hover:text-white sm:h-8"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-5 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Perubahan langsung tersimpan ke database melalui REST API.</p>
          <Link to="/contents" className="text-stone-600 underline-offset-2 hover:text-stone-900 hover:underline sm:hidden">
            Lihat katalog publik
          </Link>
        </div>
      </footer>
    </div>
  );
}
