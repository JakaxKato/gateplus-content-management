import { LogIn } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Field, FormErrorBanner } from '../../components/ui/form-controls';
import { inputClasses } from '../../components/ui/input-styles';
import { useAuth } from '../../hooks/use-auth';
import { ApiError } from '../../lib/api';

interface FieldErrors {
  email?: string;
  password?: string;
}

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin/contents" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors: FieldErrors = {};
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-100 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-900 text-[13px] font-semibold text-white">
            G
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-stone-900">Gateplus</span>
            <span className="text-sm text-stone-500">Admin</span>
          </span>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <h1 className="text-lg font-semibold tracking-tight text-stone-900">Masuk ke panel admin</h1>
          <p className="mt-1 text-sm text-stone-600">
            Panel admin dipakai untuk mengelola konten. Katalog publik tidak memerlukan login.
          </p>

          {error ? (
            <div className="mt-5">
              <FormErrorBanner message={error} />
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
            <Field label="Email" htmlFor="email" error={fieldErrors.email}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@gateplus.id"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
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
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
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

          <div className="mt-6 border-t border-stone-200 pt-4">
            <p className="text-xs text-stone-600">
              Kredensial demo: <span className="font-mono text-stone-800">admin@gateplus.id</span> /{' '}
              <span className="font-mono text-stone-800">admin123</span>
            </p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={fillDemoCredentials}>
              Isi otomatis kredensial demo
            </Button>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-stone-500">
          <Link to="/contents" className="underline-offset-2 hover:text-stone-800 hover:underline">
            Kembali ke katalog publik
          </Link>
        </p>
      </div>
    </div>
  );
}
