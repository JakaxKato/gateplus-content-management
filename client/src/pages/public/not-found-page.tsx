import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Compass className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="mt-6 text-sm font-bold tracking-widest text-indigo-600 uppercase">404</p>
      <h1 className="mt-2 text-2xl font-extrabold text-slate-900">Halaman tidak ditemukan</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Alamat yang Anda buka tidak tersedia. Kembali ke daftar content untuk melanjutkan.
      </p>
      <Link to="/contents" className="mt-6">
        <Button>Kembali ke daftar content</Button>
      </Link>
    </div>
  );
}
