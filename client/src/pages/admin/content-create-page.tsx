import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPageHeader } from '../../components/admin/admin-page-header';
import { ContentForm } from '../../components/admin/content-form';
import { useCreateContent } from '../../hooks/use-content-mutations';
import { useToast } from '../../hooks/use-toast';
import { ApiError } from '../../lib/api';
import { emptyFormValues, type ContentPayload } from '../../lib/content-form';
import type { FieldError } from '../../types/content';

export function ContentCreatePage() {
  const createContent = useCreateContent();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [serverFieldErrors, setServerFieldErrors] = useState<FieldError[] | undefined>(undefined);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (payload: ContentPayload) => {
    setServerFieldErrors(undefined);
    setFormError(null);

    createContent.mutate(payload, {
      onSuccess: (response) => {
        showToast(response.message ?? 'Content berhasil dibuat.', 'success');
        navigate('/admin/contents');
      },
      onError: (error) => {
        if (error instanceof ApiError && error.errors && error.errors.length > 0) {
          setServerFieldErrors(error.errors);
          setFormError('Beberapa isian belum valid. Periksa kembali field yang ditandai.');
          return;
        }
        setFormError(error instanceof ApiError ? error.message : 'Gagal menyimpan content. Silakan coba lagi.');
      },
    });
  };

  return (
    <div>
      <AdminPageHeader
        title="Tambah Content"
        description="Lengkapi informasi content. Validasi dijalankan di frontend dan backend."
      />
      <ContentForm
        mode="create"
        defaultValues={emptyFormValues}
        onSubmit={handleSubmit}
        isSubmitting={createContent.isPending}
        serverFieldErrors={serverFieldErrors}
        formError={formError}
      />
    </div>
  );
}
