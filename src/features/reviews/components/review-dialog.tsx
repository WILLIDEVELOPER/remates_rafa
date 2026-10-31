"use client";

import { Button, Modal, useOverlayState } from "@heroui/react";
import { PenLine } from "lucide-react";
import { ReviewForm } from "./review-form";

interface ReviewDialogProps {
  remateId: string;
  remateNombre: string;
}

/** Botón "Escribir una reseña" que abre el formulario en dos pasos. */
export function ReviewDialog({ remateId, remateNombre }: ReviewDialogProps) {
  const state = useOverlayState();

  return (
    <>
      <Button variant="outline" onPress={state.open} className="h-11 rounded-full font-medium">
        <PenLine className="size-4" />
        Escribir una reseña
      </Button>

      <Modal.Backdrop variant="blur" isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container size="lg" scroll="outside">
          <Modal.Dialog className="sm:max-w-xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Escribir una reseña</Modal.Heading>
              <p className="text-sm text-muted">{remateNombre}</p>
            </Modal.Header>
            <Modal.Body className="p-1">
              <ReviewForm remateId={remateId} onSuccess={state.close} />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
