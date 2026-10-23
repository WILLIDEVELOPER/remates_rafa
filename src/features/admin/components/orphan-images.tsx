"use client";

import { AlertDialog, Alert, Button, Checkbox, Spinner, toast } from "@heroui/react";
import { ExternalLink, ImageOff, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { formatBytes, formatDateTime, formatMinutes } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ListOrphanImagesOutput } from "@/server/application/dtos/orphan-image-dto";
import { deleteOrphanImagesAction } from "../services/admin-service";

type Pending = { mode: "selected" | "all" } | null;

export function OrphanImages({ data }: { data: ListOrphanImagesOutput }) {
  const router = useRouter();
  const { items, totalBytes, recentCount, minAgeMinutes } = data;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Pending>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Se ignoran selecciones de imágenes que ya no aparecen (p. ej. tras borrar y refrescar).
  const visibleKeys = new Set(items.map((item) => item.key));
  const activeSelection = [...selected].filter((key) => visibleKeys.has(key));
  const allSelected = items.length > 0 && activeSelection.length === items.length;

  const selectedBytes = items
    .filter((item) => selected.has(item.key))
    .reduce((sum, item) => sum + item.size, 0);

  const toggle = (key: string, on: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      if (on) next.add(key);
      else next.delete(key);
      return next;
    });

  const confirmDelete = async () => {
    if (!pending) return;
    setIsDeleting(true);
    const result = await deleteOrphanImagesAction(
      pending.mode === "all" ? {} : { keys: activeSelection },
    );
    setIsDeleting(false);

    if (!result.ok) {
      toast.danger("No se pudieron eliminar las imágenes", { description: result.error.message });
      return;
    }

    const { deleted, skipped, freedBytes } = result.data;
    toast.success(
      deleted === 1 ? "1 imagen eliminada" : `${deleted} imágenes eliminadas`,
      {
        description:
          skipped > 0
            ? `Se liberaron ${formatBytes(freedBytes)}. ${skipped} no se tocaron porque ya están en uso o son recientes.`
            : `Se liberaron ${formatBytes(freedBytes)}.`,
      },
    );
    setPending(null);
    setSelected(new Set());
    router.refresh();
  };

  const targetCount = pending?.mode === "all" ? items.length : activeSelection.length;
  const targetBytes = pending?.mode === "all" ? totalBytes : selectedBytes;

  return (
    <div className="flex flex-col gap-6">
      <Alert status="accent">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>¿Qué es una imagen huérfana?</Alert.Title>
          <Alert.Description>
            Es una imagen que está en el almacenamiento pero que ningún remate usa, ni activo ni
            eliminado (un remate eliminado se puede restaurar, así que conserva las suyas). Suelen
            quedar cuando se sube una foto y el formulario no se guarda. Por seguridad no se listan
            las subidas de hace menos de {formatMinutes(minAgeMinutes)}
            {recentCount > 0 ? ` (ahora hay ${recentCount})` : ""}.
          </Alert.Description>
        </Alert.Content>
      </Alert>

      {items.length === 0 ? (
        <EmptyState
          icon={ImageOff}
          title="No hay imágenes huérfanas"
          description="Todas las imágenes del almacenamiento están en uso por algún remate. ¡Todo en orden!"
        />
      ) : (
        <>
          <div className="flex flex-col gap-4 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <Checkbox
                isSelected={allSelected}
                isIndeterminate={activeSelection.length > 0 && !allSelected}
                onChange={(on) => setSelected(on ? new Set(items.map((item) => item.key)) : new Set())}
              >
                <Checkbox.Content>
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <span className="text-sm font-medium">Seleccionar todas</span>
                </Checkbox.Content>
              </Checkbox>
              <p className="pl-7 text-xs text-muted" aria-live="polite">
                {items.length} {items.length === 1 ? "imagen" : "imágenes"} · {formatBytes(totalBytes)}
                {activeSelection.length > 0
                  ? ` · ${activeSelection.length} seleccionada${activeSelection.length === 1 ? "" : "s"} (${formatBytes(selectedBytes)})`
                  : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                isDisabled={activeSelection.length === 0}
                onPress={() => setPending({ mode: "selected" })}
                className="rounded-full"
              >
                <Trash2 className="size-4" />
                Eliminar seleccionadas{activeSelection.length > 0 ? ` (${activeSelection.length})` : ""}
              </Button>
              <Button variant="danger" onPress={() => setPending({ mode: "all" })} className="rounded-full">
                <Trash2 className="size-4" />
                Eliminar todas
              </Button>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => {
              const isOn = selected.has(item.key);
              return (
                <li
                  key={item.key}
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-surface transition-colors",
                    isOn ? "border-foreground" : "border-border",
                  )}
                >
                  <div className="relative aspect-[4/3] bg-surface-secondary">
                    <Image
                      src={item.url}
                      alt={`Imagen huérfana ${item.key.slice(8, 16)}`}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 rounded-lg bg-background/90 p-1.5 backdrop-blur">
                      <Checkbox
                        aria-label={`Seleccionar imagen ${item.key.slice(8, 16)}`}
                        isSelected={isOn}
                        onChange={(on) => toggle(item.key, on)}
                      >
                        <Checkbox.Content>
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                        </Checkbox.Content>
                      </Checkbox>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-3">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-mono text-xs">{item.key.slice(8)}</span>
                      <span className="text-xs text-muted">
                        {formatBytes(item.size)} · {formatDateTime(item.lastModified)}
                      </span>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Abrir imagen en una pestaña nueva"
                      className="shrink-0 rounded-full p-2 text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <AlertDialog.Backdrop
        variant="blur"
        isOpen={pending !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setPending(null);
        }}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[440px]">
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>
                ¿Eliminar {targetCount} {targetCount === 1 ? "imagen" : "imágenes"} para siempre?
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                Se borrarán del almacenamiento y liberarán {formatBytes(targetBytes)}. Esta acción no
                se puede deshacer. Antes de borrar se vuelve a comprobar que ningún remate las use.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button variant="tertiary" isDisabled={isDeleting} onPress={() => setPending(null)}>
                Cancelar
              </Button>
              <Button variant="danger" isPending={isDeleting} onPress={confirmDelete}>
                {({ isPending }) => (
                  <>
                    {isPending ? <Spinner color="current" size="sm" /> : null}
                    Eliminar
                  </>
                )}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </div>
  );
}
