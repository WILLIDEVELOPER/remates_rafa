"use client";

import { Button, Modal, useOverlayState } from "@heroui/react";
import { FileCheck2 } from "lucide-react";
import { ContactForm } from "./contact-form";

interface RutServiceDialogProps {
  remateId: string;
  remateNombre: string;
}

/** CTA para contratar la gestión del RUT como postor: la solicitud llega al admin marcada como tal. */
export function RutServiceDialog({ remateId, remateNombre }: RutServiceDialogProps) {
  const state = useOverlayState();

  return (
    <>
      <Button onPress={state.open} className="h-11 w-full rounded-full font-medium sm:w-auto">
        <FileCheck2 className="size-4" />
        Solicitar gestión del RUT
      </Button>

      <Modal.Backdrop variant="blur" isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container size="lg" scroll="outside">
          <Modal.Dialog className="sm:max-w-xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Gestión del RUT como postor</Modal.Heading>
              <p className="text-sm text-muted">{remateNombre}</p>
            </Modal.Header>
            <Modal.Body className="p-1">
              <ContactForm
                remateId={remateId}
                servicio="gestion_rut"
                defaultMessage={`Hola, quiero contratar la gestión del RUT como postor para participar en el remate «${remateNombre}» (DIAN).`}
                onSuccess={state.close}
              />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
