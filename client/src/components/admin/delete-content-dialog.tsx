import { Trash2 } from 'lucide-react';
import { useDeleteContent } from '../../hooks/use-content-mutations';
import { useToast } from '../../hooks/use-toast';
import { ApiError } from '../../lib/api';
import type { Content } from '../../types/content';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';

interface DeleteContentDialogProps {
  content: Content | null;
  onClose: () => void;
}

export function DeleteContentDialog({ content, onClose }: DeleteContentDialogProps) {
  const deleteContent = useDeleteContent();
  const { showToast } = useToast();

  const handleDelete = () => {
    if (!content) {
      return;
    }

    deleteContent.mutate(content.id, {
      onSuccess: (response) => {
        showToast(response.message ?? 'Konten berhasil dihapus.', 'success');
        onClose();
      },
      onError: (error) => {
        showToast(error instanceof ApiError ? error.message : 'Gagal menghapus konten.', 'error');
      },
    });
  };

  return (
    <Modal open={content !== null} title="Hapus konten?" onClose={onClose}>
      <p className="text-sm leading-relaxed text-stone-600">
        Konten <span className="font-medium text-stone-900">“{content?.title}”</span> akan dihapus permanen dan tidak
        bisa dikembalikan.
      </p>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose} disabled={deleteContent.isPending}>
          Batal
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          loading={deleteContent.isPending}
          icon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
        >
          Hapus permanen
        </Button>
      </div>
    </Modal>
  );
}
