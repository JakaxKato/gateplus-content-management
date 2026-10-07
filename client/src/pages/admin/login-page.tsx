import { KeyRound, LogIn } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Field, FormErrorBanner } from '../../components/ui/form-controls';
import { inputClasses } from '../../components/ui/input-styles';
import { useAuth } from '../../hooks/use-auth';
import { ApiError } from '../../lib/api';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin/contents" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      validationErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      validationErrors.email = 'Format email tidak valid';
    }
    if (!password) {
      validationErrors.password = 'Password wajib diisi';
    }

    setFieldErrors(validationErrors);
    setError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from && from.startsWith('/admin') ? from : '/admin/contents', { replace: true });
    } catch (submitError) {
      setError(submitError instanceof ApiError ? submitError.message : 'Login gagal. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@gateplus.id');
    setPassword('admin123');
    setFieldErrors({});
    setError(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-base font-extrabold text-white">
            G
          </span>
          <div className="leading-tight">
            <p className="text-base font-bold text-slate-900">Gateplus</p>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Masuk ke panel admin</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gunakan akun admin untuk mengelola content. Halaman publik tidak memerlukan login.
          </p>

          <div className="mt-6 space-y-5">
            {error ? <FormErrorBanner message={error} /> : null}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Field label="Email" htmlFor="email" error={fieldErrors.email}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@gateplus.id"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={inputClasses(Boolean(fieldErrors.email))}
                />
              </Field>

              <Field label="Password" htmlFor="password" error={fieldErrors.password}>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={Boolean(fieldErrors.password)}
                  className={inputClasses(Boolean(fieldErrors.password))}
                />
              </Field>

              <Button
                type="submit"
                className="w-full"
                loading={isSubmitting}
                icon={<LogIn className="h-4 w-4" aria-hidden="true" />}
              >
                Masuk
              </Button>
            </form>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-slate-600 uppercase">
                <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                Kredensial demo
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Email: <span className="font-mono font-semibold">admin@gateplus.id</span>
                <br />
                Password: <span className="font-mono font-semibold">admin123</span>
              </p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={fillDemoCredentials}>
                Isi otomatis kredensial demo
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Kembali ke{' '}
          <Link to="/contents" className="font-semibold text-indigo-600 hover:underline">
            halaman publik
          </Link>
        </p>
      </div>
    </div>
  );
}
