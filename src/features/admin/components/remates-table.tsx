"use client";

import {
  Button,
  Chip,
  Dropdown,
  Switch,
  Table,
  toast,
} from "@heroui/react";
import {
  ExternalLink,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  SearchX,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { EstadoChip } from "@/components/ui/estado-chip";
import { formatCOP, formatDate, formatLocation } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { RemateDto } from "@/server/application/dtos/remate-dto";
import { setDestacadoAction, updateRemateAction } from "../services/admin-service";
import { DeleteRemateDialog } from "./delete-remate-dialog";

export function RematesTable({ remates }: { remates: RemateDto[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [toDelete, setToDelete] = useState<RemateDto | null>(null);

  const [rows, setOptimisticDestacado] = useOptimistic(
    remates,
    (state, change: { id: string; destacado: boolean }) =>
      state.map((row) => (row.id === change.id ? { ...row, destacado: change.destacado } : row)),
  );

  const setDestacado = (remate: RemateDto, destacado: boolean) => {
    startTransition(async () => {
      setOptimisticDestacado({ id: remate.id, destacado });
      const result = await setDestacadoAction({ id: remate.id, destacado });

      if (result.ok) {
        toast.success(destacado ? "Remate destacado" : "Remate ya no está destacado", {
          description: remate.nombre,
        });
      } else {
        toast.danger("No se pudo actualizar", { description: result.error.message });
      }
      router.refresh();
    });
  };

  const restore = (remate: RemateDto) => {
    startTransition(async () => {
      const result = await updateRemateAction({ id: remate.id, activo: true });

      if (result.ok) {
        toast.success("Remate restaurado", { description: remate.nombre });
      } else {
        toast.danger("No se pudo restaurar", { description: result.error.message });
      }
      router.refresh();
    });
  };

  const onAction = (remate: RemateDto, key: string | number) => {
    switch (key) {
      case "ver":
        window.open(`/remates/${remate.slug}`, "_blank", "noopener");
        break;
      case "editar":
        router.push(`/admin/remates/${remate.id}/editar`);
        break;
      case "destacar":
        setDestacado(remate, !remate.destacado);
        break;
      case "restaurar":
        restore(remate);
        break;
      case "eliminar":
        setToDelete(remate);
        break;
    }
  };

  return (
    <>
      <Table variant="secondary">
        <Table.ScrollContainer>
          <Table.Content aria-label="Remates" className="min-w-[1000px]">
            <Table.Header>
              <Table.Column isRowHeader id="remate">Remate</Table.Column>
              <Table.Column id="ubicacion">Ubicación</Table.Column>
              <Table.Column id="precio">Precio base</Table.Column>
              <Table.Column id="estado">Estado</Table.Column>
              <Table.Column id="destacado">Destacado</Table.Column>
              <Table.Column id="creado">Creado</Table.Column>
              <Table.Column id="acciones">
                <span className="sr-only">Acciones</span>
              </Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="flex flex-col items-center gap-3 py-14 text-center">
                  <SearchX className="size-6 text-muted" />
                  <p className="text-sm text-muted">No hay remates con estos filtros.</p>
                </div>
              )}
            >
              {rows.map((remate) => (
                <Table.Row key={remate.id} id={remate.id}>
                  <Table.Cell>
                    <div className={cn("flex items-center gap-3", !remate.activo && "opacity-60")}>
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface-secondary">
                        {remate.imagenPrincipalUrl ? (
                          <Image src={remate.imagenPrincipalUrl} alt="" fill sizes="48px" className="object-cover" />
                        ) : null}
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <Link
                          href={`/admin/remates/${remate.id}/editar`}
                          className="max-w-64 truncate text-sm font-medium hover:underline"
                        >
                          {remate.nombre}
                        </Link>
                        <span className="max-w-64 truncate text-xs text-muted">/{remate.slug}</span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="text-sm">{remate.departamento}</span>
                      <span className="text-xs text-muted">
                        {formatLocation([remate.ciudad, remate.municipio])}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm font-medium whitespace-nowrap">{formatCOP(remate.precioBase)}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1.5">
                      <EstadoChip estado={remate.estado} />
                      {!remate.activo ? (
                        <Chip size="sm" variant="secondary" className="rounded-full">
                          Eliminado
                        </Chip>
                      ) : null}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Switch
                      aria-label={`Destacar ${remate.nombre}`}
                      isSelected={remate.destacado}
                      isDisabled={!remate.activo}
                      onChange={(selected) => setDestacado(remate, selected)}
                    >
                      <Switch.Content>
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch.Content>
                    </Switch>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm whitespace-nowrap text-muted">{formatDate(remate.createdAt)}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Dropdown>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        aria-label={`Acciones de ${remate.nombre}`}
                        className="rounded-full"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                      <Dropdown.Popover className="min-w-48">
                        <Dropdown.Menu onAction={(key) => onAction(remate, key)}>
                          <Dropdown.Item id="ver" textValue="Ver en el sitio">
                            <ExternalLink className="size-4 shrink-0 text-muted" />
                            Ver en el sitio
                          </Dropdown.Item>
                          <Dropdown.Item id="editar" textValue="Editar">
                            <Pencil className="size-4 shrink-0 text-muted" />
                            Editar
                          </Dropdown.Item>
                          {remate.activo ? (
                            <Dropdown.Item
                              id="destacar"
                              textValue={remate.destacado ? "Quitar destacado" : "Destacar"}
                            >
                              {remate.destacado ? (
                                <StarOff className="size-4 shrink-0 text-muted" />
                              ) : (
                                <Star className="size-4 shrink-0 text-muted" />
                              )}
                              {remate.destacado ? "Quitar destacado" : "Destacar"}
                            </Dropdown.Item>
                          ) : null}
                          {remate.activo ? (
                            <Dropdown.Item id="eliminar" textValue="Eliminar" variant="danger">
                              <Trash2 className="size-4 shrink-0 text-danger" />
                              Eliminar
                            </Dropdown.Item>
                          ) : (
                            <Dropdown.Item id="restaurar" textValue="Restaurar">
                              <RotateCcw className="size-4 shrink-0 text-muted" />
                              Restaurar
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <DeleteRemateDialog remate={toDelete} onClose={() => setToDelete(null)} />
    </>
  );
}
