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
        showToast(response.message ?? 'Content berhasil dihapus.', 'success');
        onClose();
      },
      onError: (error) => {
        showToast(error instanceof ApiError ? error.message : 'Gagal menghapus content.', 'error');
      },
    });
  };

  return (
    <Modal open={content !== null} title="Hapus content?" onClose={onClose}>
      <p className="text-sm leading-relaxed text-slate-600">
        Content <span className="font-semibold text-slate-900">“{content?.title}”</span> akan dihapus permanen dari
        database. Tindakan ini tidak dapat dibatalkan.
      </p>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={deleteContent.isPending}>
          Batal
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          loading={deleteContent.isPending}
          icon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
        >
          Ya, hapus
        </Button>
      </div>
    </Modal>
  );
}
