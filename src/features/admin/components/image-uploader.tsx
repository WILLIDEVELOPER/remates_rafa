"use client";

import { Button, toast } from "@heroui/react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, TriangleAlert, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_MB,
  MAX_IMAGES,
} from "../schemas/remate-form-schema";
import { createImageUploadsAction } from "../services/admin-service";

interface UploaderItem {
  id: string;
  /** Referencia que se guarda en el remate; `null` mientras sube o si falló. */
  ref: string | null;
  src: string;
  isBlob: boolean;
  name: string;
  status: "uploading" | "done" | "error";
  progress: number;
  error?: string;
}

export interface InitialImage {
  ref: string;
  url: string;
}

interface ImageUploaderProps {
  initialImages?: InitialImage[];
  onChange: (refs: string[]) => void;
  onBusyChange?: (busy: boolean) => void;
  isInvalid?: boolean;
}

function putFile(url: string, file: File, onProgress: (percent: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`La subida falló (código ${xhr.status}).`));
    xhr.onerror = () => reject(new Error("Error de red al subir la imagen."));
    xhr.send(file);
  });
}

const isAccepted = (type: string) => (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(type);

export function ImageUploader({
  initialImages = [],
  onChange,
  onBusyChange,
  isInvalid,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploaderItem[]>(() =>
    initialImages.map((image) => ({
      id: crypto.randomUUID(),
      ref: image.ref,
      src: image.url,
      isBlob: false,
      name: image.ref,
      status: "done",
      progress: 100,
    })),
  );
  // Espejo síncrono de `items` para los callbacks asíncronos de la subida.
  const itemsRef = useRef(items);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);

  // Libera las vistas previas locales al salir.
  useEffect(() => {
    const itemsAtMount = itemsRef;
    return () => {
      for (const item of itemsAtMount.current) {
        if (item.isBlob) URL.revokeObjectURL(item.src);
      }
    };
  }, []);

  /** Única vía para cambiar la lista: mantiene estado, formulario y "ocupado" sincronizados. */
  const apply = (update: (current: UploaderItem[]) => UploaderItem[]) => {
    const next = update(itemsRef.current);
    itemsRef.current = next;
    setItems(next);
    onChange(next.flatMap((item) => (item.status === "done" && item.ref ? [item.ref] : [])));
    onBusyChange?.(next.some((item) => item.status === "uploading"));
  };

  const patch = (id: string, changes: Partial<UploaderItem>) =>
    apply((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));

  const addFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const rejected: string[] = [];

    const valid = files.filter((file) => {
      if (!isAccepted(file.type)) {
        rejected.push(`${file.name}: formato no permitido (usa JPG, PNG o WebP)`);
        return false;
      }
      if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
        rejected.push(`${file.name}: pesa más de ${MAX_IMAGE_MB} MB`);
        return false;
      }
      return true;
    });

    const room = MAX_IMAGES - itemsRef.current.length;
    const accepted = valid.slice(0, Math.max(0, room));
    if (valid.length > accepted.length) {
      rejected.push(`Solo puedes tener ${MAX_IMAGES} imágenes por remate`);
    }
    if (rejected.length > 0) {
      toast.danger("Algunas imágenes no se agregaron", { description: rejected.join(". ") });
    }
    if (accepted.length === 0) return;

    const pending = accepted.map<UploaderItem>((file) => ({
      id: crypto.randomUUID(),
      ref: null,
      src: URL.createObjectURL(file),
      isBlob: true,
      name: file.name,
      status: "uploading",
      progress: 0,
    }));
    apply((current) => [...current, ...pending]);

    const signed = await createImageUploadsAction({
      files: accepted.map((file) => ({
        name: file.name,
        contentType: file.type,
        size: file.size,
      })),
    });

    if (!signed.ok) {
      for (const item of pending) patch(item.id, { status: "error", error: signed.error.message });
      toast.danger("No se pudo iniciar la subida", { description: signed.error.message });
      return;
    }

    await Promise.all(
      signed.data.map(async (target, index) => {
        const item = pending[index];
        try {
          await putFile(target.uploadUrl, accepted[index], (progress) => patch(item.id, { progress }));
          patch(item.id, { status: "done", progress: 100, ref: target.key });
        } catch (error) {
          const message = error instanceof Error ? error.message : "No se pudo subir la imagen.";
          patch(item.id, { status: "error", error: message });
          toast.danger(`No se pudo subir ${item.name}`, { description: message });
        }
      }),
    );
  };

  const remove = (id: string) =>
    apply((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.isBlob) URL.revokeObjectURL(target.src);
      return current.filter((item) => item.id !== id);
    });

  const move = (from: number, to: number) => {
    if (to < 0 || to >= itemsRef.current.length || from === to) return;
    apply((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const onDropZone = (event: DragEvent) => {
    event.preventDefault();
    setIsDraggingFiles(false);
    if (event.dataTransfer.files.length > 0) void addFiles(event.dataTransfer.files);
  };

  const full = items.length >= MAX_IMAGES;

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(event) => {
          if (event.dataTransfer.types.includes("Files")) {
            event.preventDefault();
            setIsDraggingFiles(true);
          }
        }}
        onDragLeave={() => setIsDraggingFiles(false)}
        onDrop={onDropZone}
        className={cn(
          "flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-8 text-center transition-colors",
          isDraggingFiles ? "border-foreground bg-surface-secondary" : "border-border",
          isInvalid && "border-danger",
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-surface-secondary">
          <ImagePlus className="size-5" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Arrastra tus imágenes aquí</p>
          <p className="text-xs text-muted">
            JPG, PNG o WebP · máximo {MAX_IMAGE_MB} MB cada una · hasta {MAX_IMAGES} ({items.length}/{MAX_IMAGES})
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          isDisabled={full}
          onPress={() => inputRef.current?.click()}
          className="rounded-full"
        >
          Seleccionar archivos
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="sr-only"
          aria-label="Seleccionar imágenes"
          onChange={(event) => {
            if (event.target.files) void addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {items.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item, index) => (
            <li
              key={item.id}
              draggable={item.status === "done"}
              onDragStart={() => setDragIndex(index)}
              onDragEnd={() => setDragIndex(null)}
              onDragOver={(event) => {
                if (dragIndex !== null) event.preventDefault();
              }}
              onDrop={(event) => {
                if (dragIndex === null) return;
                event.preventDefault();
                move(dragIndex, index);
                setDragIndex(null);
              }}
              className={cn(
                "group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface-secondary",
                dragIndex === index && "opacity-50",
                item.status === "done" && "cursor-grab",
              )}
            >
              <Image
                src={item.src}
                alt={`Imagen ${index + 1}`}
                fill
                unoptimized={item.isBlob}
                sizes="200px"
                className="object-cover"
                draggable={false}
              />

              {index === 0 && item.status === "done" ? (
                <span className="absolute top-2 left-2 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-background">
                  Principal
                </span>
              ) : null}

              {item.status === "uploading" ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/75 backdrop-blur-sm">
                  <Loader2 className="size-5 animate-spin" />
                  <span className="text-xs font-medium">{item.progress}%</span>
                  <div className="h-1 w-3/4 overflow-hidden rounded-full bg-border">
                    <div className="h-full bg-foreground transition-all" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ) : null}

              {item.status === "error" ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-background/85 p-2 text-center">
                  <TriangleAlert className="size-5 text-danger" />
                  <span className="line-clamp-3 text-[11px] text-danger">{item.error}</span>
                </div>
              ) : null}

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                <div className="flex gap-1">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="secondary"
                    aria-label="Mover a la izquierda"
                    isDisabled={index === 0 || item.status !== "done"}
                    onPress={() => move(index, index - 1)}
                    className="size-7 min-w-0 rounded-full"
                  >
                    <ArrowLeft className="size-3.5" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="secondary"
                    aria-label="Mover a la derecha"
                    isDisabled={index === items.length - 1 || item.status !== "done"}
                    onPress={() => move(index, index + 1)}
                    className="size-7 min-w-0 rounded-full"
                  >
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
                <Button
                  isIconOnly
                  size="sm"
                  variant="danger"
                  aria-label={`Quitar imagen ${index + 1}`}
                  onPress={() => remove(item.id)}
                  className="size-7 min-w-0 rounded-full"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
