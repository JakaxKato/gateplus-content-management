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
import { buttonClasses } from '../ui/button-styles';
import { Field, FormErrorBanner } from '../ui/form-controls';
import { inputClasses, selectClasses, textareaClasses } from '../ui/input-styles';
import { sectionLabel, surface } from '../ui/tokens';
import { Thumbnail } from '../ui/thumbnail';

const FORM_FIELDS = ['title', 'description', 'genre', 'thumbnail_url', 'status', 'published_at'];

const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: 'Draft',
  published: 'Published',
};

const STATUS_HINTS: Record<ContentStatus, string> = {
  draft: 'Disimpan sebagai konsep, belum tampil di katalog publik.',
  published: 'Tampil di katalog publik dengan tanggal publish.',
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className={`${surface} p-5`}>
          <h2 className={sectionLabel}>Informasi utama</h2>

          <div className="mt-4 space-y-5">
            <Field label="Judul" htmlFor="title" error={errors.title?.message}>
              <input
                id="title"
                type="text"
                placeholder="Contoh: Petualangan Nusantara"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'title-error' : undefined}
                className={inputClasses(Boolean(errors.title))}
                {...register('title')}
              />
            </Field>

            <Field label="Genre" htmlFor="genre" error={errors.genre?.message}>
              <select
                id="genre"
                aria-invalid={Boolean(errors.genre)}
                aria-describedby={errors.genre ? 'genre-error' : undefined}
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
              hint="Jelaskan isi konten secara singkat, maksimal 5000 karakter."
            >
              <textarea
                id="description"
                rows={6}
                placeholder="Tuliskan deskripsi konten..."
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? 'description-error' : 'description-hint'}
                className={textareaClasses(Boolean(errors.description))}
                {...register('description')}
              />
            </Field>
          </div>

          <div className="mt-6 border-t border-stone-200 pt-5">
            <h2 className={sectionLabel}>Thumbnail</h2>

            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,1fr)_200px]">
              <Field
                label="Thumbnail URL"
                htmlFor="thumbnail_url"
                error={errors.thumbnail_url?.message}
                hint="Kosongkan bila belum ada. Gunakan URL http/https."
              >
                <input
                  id="thumbnail_url"
                  type="url"
                  placeholder="https://picsum.photos/seed/contoh/800/450"
                  aria-invalid={Boolean(errors.thumbnail_url)}
                  aria-describedby={errors.thumbnail_url ? 'thumbnail_url-error' : 'thumbnail_url-hint'}
                  className={inputClasses(Boolean(errors.thumbnail_url))}
                  {...register('thumbnail_url')}
                />
              </Field>

              <div>
                <span className="mb-1.5 block text-[13px] font-medium text-stone-800">Pratinjau</span>
                <Thumbnail
                  src={thumbnailUrl.trim() === '' ? null : thumbnailUrl}
                  alt="Pratinjau thumbnail"
                  className="rounded-md border border-stone-200"
                />
              </div>
            </div>
          </div>
        </section>

        <section className={`${surface} h-fit p-5`}>
          <h2 className={sectionLabel}>Status</h2>

          <div className="mt-4 space-y-2">
            {CONTENT_STATUSES.map((value) => (
              <label
                key={value}
                className={`block cursor-pointer rounded-md border p-3 transition-colors ${
                  status === value ? 'border-stone-400 bg-stone-50' : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <input type="radio" value={value} className="h-4 w-4 accent-amber-700" {...register('status')} />
                  <span className="text-sm font-medium text-stone-900">{STATUS_LABELS[value]}</span>
                </span>
                <span className="mt-1 block pl-[26px] text-xs leading-relaxed text-stone-500">
                  {STATUS_HINTS[value]}
                </span>
              </label>
            ))}
          </div>

          {errors.status ? <p className="mt-2 text-xs text-red-700">{errors.status.message}</p> : null}

          <div className="mt-6 border-t border-stone-200 pt-5">
            <h2 className={sectionLabel}>Publikasi</h2>

            <div className="mt-4">
              <Field
                label="Tanggal publish"
                htmlFor="published_at"
                error={errors.published_at?.message}
                hint={isDraft ? 'Tidak aktif selama status Draft.' : 'Wajib diisi saat status Published.'}
              >
                <input
                  id="published_at"
                  type="date"
                  disabled={isDraft}
                  aria-invalid={Boolean(errors.published_at)}
                  aria-describedby={errors.published_at ? 'published_at-error' : 'published_at-hint'}
                  className={inputClasses(Boolean(errors.published_at))}
                  {...register('published_at')}
                />
              </Field>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end">
        <Link to="/admin/contents" className={buttonClasses('secondary', 'md')}>
          Batal
        </Link>
        <Button type="submit" loading={isSubmitting} icon={<Save className="h-4 w-4" aria-hidden="true" />}>
          {mode === 'create' ? 'Simpan konten' : 'Simpan perubahan'}
        </Button>
      </div>
    </form>
  );
}
