import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  contentFormSchema,
  toContentPayload,
  type ContentFormInput,
  type ContentFormValues,
  type ContentPayload,
} from '../../lib/content-form';
import { CONTENT_STATUSES, GENRES, type ContentStatus, type FieldError } from '../../types/content';
import { Button } from '../ui/button';
import { Field, FormErrorBanner } from '../ui/form-controls';
import { inputClasses, selectClasses, textareaClasses } from '../ui/input-styles';
import { Thumbnail } from '../ui/thumbnail';

const FORM_FIELDS = ['title', 'description', 'genre', 'thumbnail_url', 'status', 'published_at'];

const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: 'Draft',
  published: 'Published',
};

const STATUS_HINTS: Record<ContentStatus, string> = {
  draft: 'Disimpan sebagai konsep, belum dipublikasikan.',
  published: 'Tampil sebagai konten terpublikasi di halaman publik.',
};

interface ContentFormProps {
  mode: 'create' | 'edit';
  defaultValues: ContentFormValues;
  onSubmit: (payload: ContentPayload) => void;
  isSubmitting: boolean;
  serverFieldErrors?: FieldError[];
  formError?: string | null;
}

export function ContentForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting,
  serverFieldErrors,
  formError,
}: ContentFormProps) {
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ContentFormInput, unknown, ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues,
  });

  const status = useWatch({ control, name: 'status' }) ?? 'draft';
  const thumbnailUrl = useWatch({ control, name: 'thumbnail_url' }) ?? '';
  const isDraft = status === 'draft';

  useEffect(() => {
    for (const issue of serverFieldErrors ?? []) {
      if (FORM_FIELDS.includes(issue.field)) {
        setError(issue.field as keyof ContentFormInput, { type: 'server', message: issue.message });
      }
    }
  }, [serverFieldErrors, setError]);

  const submitForm = handleSubmit((values) => onSubmit(toContentPayload(values)));

  return (
    <form onSubmit={submitForm} className="space-y-6" noValidate>
      {formError ? <FormErrorBanner message={formError} /> : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Informasi utama</h2>

            <div className="mt-4 space-y-5">
              <Field label="Judul" htmlFor="title" error={errors.title?.message}>
                <input
                  id="title"
                  type="text"
                  placeholder="Contoh: Petualangan Nusantara"
                  aria-invalid={Boolean(errors.title)}
                  className={inputClasses(Boolean(errors.title))}
                  {...register('title')}
                />
              </Field>

              <Field label="Genre" htmlFor="genre" error={errors.genre?.message}>
                <select
                  id="genre"
                  aria-invalid={Boolean(errors.genre)}
                  className={selectClasses(Boolean(errors.genre))}
                  {...register('genre')}
                >
                  {GENRES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Deskripsi"
                htmlFor="description"
                error={errors.description?.message}
                hint="Jelaskan isi content secara singkat (maks. 5000 karakter)."
              >
                <textarea
                  id="description"
                  rows={6}
                  placeholder="Tuliskan deskripsi content..."
                  aria-invalid={Boolean(errors.description)}
                  className={textareaClasses(Boolean(errors.description))}
                  {...register('description')}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Thumbnail</h2>

            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,1fr)_200px]">
              <Field
                label="Thumbnail URL"
                htmlFor="thumbnail_url"
                error={errors.thumbnail_url?.message}
                hint="Kosongkan jika belum ada thumbnail. Gunakan URL http/https."
              >
                <input
                  id="thumbnail_url"
                  type="url"
                  placeholder="https://picsum.photos/seed/contoh/800/450"
                  aria-invalid={Boolean(errors.thumbnail_url)}
                  className={inputClasses(Boolean(errors.thumbnail_url))}
                  {...register('thumbnail_url')}
                />
              </Field>

              <div>
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Pratinjau</span>
                <Thumbnail
                  src={thumbnailUrl.trim() === '' ? null : thumbnailUrl}
                  alt="Pratinjau thumbnail"
                  className="rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Status</h2>

            <div className="mt-4 space-y-3">
              {CONTENT_STATUSES.map((value) => (
                <label
                  key={value}
                  className={`block cursor-pointer rounded-xl border p-3 transition ${
                    status === value
                      ? 'border-indigo-400 bg-indigo-50/70 ring-1 ring-indigo-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <input type="radio" value={value} className="h-4 w-4 accent-indigo-600" {...register('status')} />
                    <span className="text-sm font-semibold text-slate-800">{STATUS_LABELS[value]}</span>
                  </span>
                  <span className="mt-1.5 block pl-6.5 text-xs leading-relaxed text-slate-500">
                    {STATUS_HINTS[value]}
                  </span>
                </label>
              ))}
            </div>

            {errors.status ? <p className="mt-2 text-xs font-medium text-red-600">{errors.status.message}</p> : null}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Publikasi</h2>

            <div className="mt-4">
              <Field
                label="Tanggal publish"
                htmlFor="published_at"
                error={errors.published_at?.message}
                hint={
                  isDraft
                    ? 'Tidak aktif selama status Draft.'
                    : 'Wajib diisi saat status Published. Tanggal tidak boleh kosong.'
                }
              >
                <input
                  id="published_at"
                  type="date"
                  disabled={isDraft}
                  aria-invalid={Boolean(errors.published_at)}
                  className={`${inputClasses(Boolean(errors.published_at))} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`}
                  {...register('published_at')}
                />
              </Field>
            </div>
          </section>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
        <Link
          to="/admin/contents"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Batal
        </Link>
        <Button type="submit" loading={isSubmitting} icon={<Save className="h-4 w-4" aria-hidden="true" />}>
          {mode === 'create' ? 'Simpan content' : 'Simpan perubahan'}
        </Button>
      </div>
    </form>
  );
}
