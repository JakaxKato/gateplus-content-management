import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminPageHeader } from '../../components/admin/admin-page-header';
import { ContentForm } from '../../components/admin/content-form';
import { Button } from '../../components/ui/button';
import { ErrorState } from '../../components/ui/feedback';
import { useContent } from '../../hooks/use-contents';
import { useUpdateContent } from '../../hooks/use-content-mutations';
import { useToast } from '../../hooks/use-toast';
import { ApiError } from '../../lib/api';
import { toFormValues, type ContentPayload } from '../../lib/content-form';
import type { FieldError } from '../../types/content';

function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="h-64 rounded-2xl bg-slate-100" />
          <div className="h-48 rounded-2xl bg-slate-100" />
        </div>
        <div className="space-y-6">
          <div className="h-40 rounded-2xl bg-slate-100" />
          <div className="h-32 rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function ContentEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const contentQuery = useContent(id);
  const updateContent = useUpdateContent(id ?? '');

  const [serverFieldErrors, setServerFieldErrors] = useState<FieldError[] | undefined>(undefined);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (payload: ContentPayload) => {
    setServerFieldErrors(undefined);
    setFormError(null);

    updateContent.mutate(payload, {
      onSuccess: (response) => {
        showToast(response.message ?? 'Content berhasil diperbarui.', 'success');
        navigate('/admin/contents');
      },
      onError: (error) => {
        if (error instanceof ApiError && error.errors && error.errors.length > 0) {
          setServerFieldErrors(error.errors);
          setFormError('Beberapa isian belum valid. Periksa kembali field yang ditandai.');
          return;
        }
        setFormError(error instanceof ApiError ? error.message : 'Gagal menyimpan perubahan. Silakan coba lagi.');
      },
    });
  };

  const reloadContent = () => {
    setServerFieldErrors(undefined);
    setFormError(null);
    void contentQuery.refetch();
  };

  return (
    <div>
      <AdminPageHeader
        title="Edit Content"
        description="Perubahan akan langsung tersimpan ke database melalui REST API."
        action={
          <Button variant="secondary" onClick={reloadContent} loading={contentQuery.isRefetching}>
            Muat ulang data
          </Button>
        }
      />

      {contentQuery.isPending ? (
        <FormSkeleton />
      ) : contentQuery.isError ? (
        <ErrorState
          title={
            contentQuery.error instanceof ApiError && contentQuery.error.status === 404
              ? 'Content tidak ditemukan'
              : 'Gagal memuat content'
          }
          message={
            contentQuery.error instanceof ApiError
              ? contentQuery.error.message
              : 'Terjadi kesalahan tak terduga saat memuat data.'
          }
          onRetry={() => void contentQuery.refetch()}
        />
      ) : (
        <ContentForm
          key={contentQuery.data.data.id}
          mode="edit"
          defaultValues={toFormValues(contentQuery.data.data)}
          onSubmit={handleSubmit}
          isSubmitting={updateContent.isPending}
          serverFieldErrors={serverFieldErrors}
          formError={formError}
        />
      )}
    </div>
  );
}
