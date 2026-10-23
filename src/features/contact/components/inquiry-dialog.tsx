"use client";

import { Button, Modal, useOverlayState } from "@heroui/react";
import { MessageSquareText } from "lucide-react";
import { ContactForm } from "./contact-form";

interface InquiryDialogProps {
  remateId: string;
  remateNombre: string;
}

/** Botón "Solicitar información" que abre un formulario ligado al remate. */
export function InquiryDialog({ remateId, remateNombre }: InquiryDialogProps) {
  const state = useOverlayState();

  return (
    <>
      <Button fullWidth onPress={state.open} className="h-11 rounded-full font-medium">
        <MessageSquareText className="size-4" />
        Solicitar información
      </Button>

      <Modal.Backdrop variant="blur" isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container size="lg" scroll="outside">
          <Modal.Dialog className="sm:max-w-xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Solicitar información</Modal.Heading>
              <p className="text-sm text-muted">{remateNombre}</p>
            </Modal.Header>
            <Modal.Body className="p-1">
              <ContactForm
                remateId={remateId}
                defaultMessage={`Hola, me interesa el remate «${remateNombre}». Quisiera recibir más información.`}
                onSuccess={state.close}
              />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
