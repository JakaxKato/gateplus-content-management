import { Link } from 'react-router-dom';
import { buttonClasses } from '../../components/ui/button-styles';
import { sectionLabel } from '../../components/ui/tokens';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <p className={sectionLabel}>Error 404</p>
      <h1 className="mt-3 text-xl font-semibold text-stone-900">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        Alamat yang Anda buka tidak tersedia atau sudah dipindahkan.
      </p>
      <Link to="/contents" className={buttonClasses('primary', 'md', 'mt-6')}>
        Kembali ke katalog
      </Link>
    </div>
  );
}
