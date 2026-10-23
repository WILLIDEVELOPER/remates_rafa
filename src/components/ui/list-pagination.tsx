"use client";

import { Pagination } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Páginas a mostrar: primera, última y una ventana alrededor de la actual. */
export function getPageNumbers(
  page: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) result.push("ellipsis");
    result.push(value);
  });
  return result;
}

interface ListPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  /** Nombre plural de lo que se lista, p. ej. "remates". */
  itemsLabel: string;
}

/** Paginación guiada por el parámetro `pagina` de la URL. */
export function ListPagination({
  page,
  totalPages,
  total,
  pageSize,
  itemsLabel,
}: ListPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (target: number) => {
    const next = new URLSearchParams(searchParams.toString());
    if (target <= 1) next.delete("pagina");
    else next.set("pagina", String(target));
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <Pagination className="flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <Pagination.Summary>
        Mostrando {from}–{to} de {total} {itemsLabel}
      </Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous isDisabled={page === 1} onPress={() => goTo(page - 1)}>
            <Pagination.PreviousIcon />
            <span>Anterior</span>
          </Pagination.Previous>
        </Pagination.Item>
        {getPageNumbers(page, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <Pagination.Item key={`ellipsis-${index}`}>
              <Pagination.Ellipsis />
            </Pagination.Item>
          ) : (
            <Pagination.Item key={item}>
              <Pagination.Link isActive={item === page} onPress={() => goTo(item)}>
                {item}
              </Pagination.Link>
            </Pagination.Item>
          ),
        )}
        <Pagination.Item>
          <Pagination.Next isDisabled={page === totalPages} onPress={() => goTo(page + 1)}>
            <span>Siguiente</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
