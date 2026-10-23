"use client";

import { AlertDialog, Button, Spinner, toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { RemateDto } from "@/server/application/dtos/remate-dto";
import { deleteRemateAction } from "../services/admin-service";

interface DeleteRemateDialogProps {
  remate: RemateDto | null;
  onClose: () => void;
}

/** Confirmación de borrado (soft delete: el remate se puede restaurar). */
export function DeleteRemateDialog({ remate, onClose }: DeleteRemateDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const confirm = async () => {
    if (!remate) return;
    setIsPending(true);
    const result = await deleteRemateAction(remate.id);
    setIsPending(false);

    if (result.ok) {
      toast.success("Remate eliminado", {
        description: `"${remate.nombre}" ya no es visible en el sitio. Puedes restaurarlo desde "Eliminados".`,
      });
      onClose();
      router.refresh();
    } else {
      toast.danger("No se pudo eliminar el remate", { description: result.error.message });
    }
  };

  return (
    <AlertDialog.Backdrop
      variant="blur"
      isOpen={remate !== null}
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-[420px]">
          <AlertDialog.Header>
            <AlertDialog.Icon status="danger" />
            <AlertDialog.Heading>¿Eliminar este remate?</AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <p>
              <strong>{remate?.nombre}</strong> dejará de mostrarse en el sitio
              público y perderá su marca de destacado. Podrás restaurarlo cuando
              quieras.
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
