"use client";

import { AlertDialog, Button, Spinner, toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminResenaDto } from "@/server/application/dtos/resena-dto";
import { deleteResenaAction } from "../services/admin-service";

interface DeleteResenaDialogProps {
  resena: AdminResenaDto | null;
  onClose: () => void;
}

/** Confirmación de borrado definitivo de una reseña. */
export function DeleteResenaDialog({ resena, onClose }: DeleteResenaDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const confirm = async () => {
    if (!resena) return;
    setIsPending(true);
    const result = await deleteResenaAction(resena.id);
    setIsPending(false);

    if (result.ok) {
      toast.success("Reseña eliminada", { description: "Ya no es visible en el sitio." });
      onClose();
      router.refresh();
    } else {
      toast.danger("No se pudo eliminar la reseña", { description: result.error.message });
    }
  };

  return (
    <AlertDialog.Backdrop
      variant="blur"
      isOpen={resena !== null}
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-[420px]">
          <AlertDialog.Header>
            <AlertDialog.Icon status="danger" />
            <AlertDialog.Heading>¿Eliminar esta reseña?</AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <p>
              La reseña de <strong>{resena?.nombre}</strong> se borrará de forma definitiva y
              no se podrá recuperar.
            </p>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button variant="tertiary" isDisabled={isPending} onPress={onClose}>
              Cancelar
            </Button>
            <Button variant="danger" isPending={isPending} onPress={confirm}>
              {({ isPending: pending }) => (
                <>
                  {pending ? <Spinner color="current" size="sm" /> : null}
                  Eliminar
                </>
              )}
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
}
