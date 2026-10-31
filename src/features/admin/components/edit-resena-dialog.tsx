"use client";

import {
  Button,
  FieldError,
  Input,
  Label,
  Modal,
  Spinner,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminResenaDto } from "@/server/application/dtos/resena-dto";
import { updateResenaAction } from "../services/admin-service";

interface EditResenaDialogProps {
  resena: AdminResenaDto | null;
  onClose: () => void;
}

function EditResenaForm({ resena, onClose }: { resena: AdminResenaDto; onClose: () => void }) {
  const router = useRouter();
  const [nombre, setNombre] = useState(resena.nombre);
  const [comentario, setComentario] = useState(resena.comentario);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isPending, setIsPending] = useState(false);

  const save = async () => {
    setIsPending(true);
    const result = await updateResenaAction({ id: resena.id, nombre, comentario });
    setIsPending(false);

    if (result.ok) {
      toast.success("Reseña actualizada");
      onClose();
      router.refresh();
      return;
    }

    setErrors(result.error.fieldErrors ?? {});
    toast.danger("No se pudo guardar la reseña", { description: result.error.message });
  };

  return (
    <>
      <Modal.Body className="flex flex-col gap-4 p-1">
        <TextField
          value={nombre}
          onChange={setNombre}
          isInvalid={Boolean(errors.nombre)}
          isRequired
          validationBehavior="aria"
          className="w-full"
        >
          <Label>Nombre</Label>
          <Input className="w-full" />
          <FieldError>{errors.nombre?.[0]}</FieldError>
        </TextField>
        <TextField
          value={comentario}
          onChange={setComentario}
          isInvalid={Boolean(errors.comentario)}
          isRequired
          validationBehavior="aria"
          className="w-full"
        >
          <Label>Reseña</Label>
          <TextArea rows={7} className="w-full" />
          <FieldError>{errors.comentario?.[0]}</FieldError>
        </TextField>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="tertiary" isDisabled={isPending} onPress={onClose}>
          Cancelar
        </Button>
        <Button isPending={isPending} onPress={save}>
          {({ isPending: pending }) => (
            <>
              {pending ? <Spinner color="current" size="sm" /> : null}
              Guardar cambios
            </>
          )}
        </Button>
      </Modal.Footer>
    </>
  );
}

/** Corrección del nombre y del texto de una reseña. El correo y el teléfono no se editan. */
export function EditResenaDialog({ resena, onClose }: EditResenaDialogProps) {
  return (
    <Modal.Backdrop
      variant="blur"
      isOpen={resena !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Modal.Container size="lg" scroll="outside">
        <Modal.Dialog className="sm:max-w-xl">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Editar reseña</Modal.Heading>
          </Modal.Header>
          {/* `key` reinicia el formulario al abrir otra reseña. */}
          {resena ? <EditResenaForm key={resena.id} resena={resena} onClose={onClose} /> : null}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
