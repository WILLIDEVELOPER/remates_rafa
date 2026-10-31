export const TIPO_LABELS = {
  casa: "Casa",
  apartamento: "Apartamento",
  lote: "Lote",
  local: "Local comercial",
  bodega: "Bodega",
  finca: "Finca",
} as const;

export const ESTADO_LABELS = {
  disponible: "Disponible",
  adjudicado: "Adjudicado",
  suspendido: "Suspendido",
} as const;

export type TipoInmuebleKey = keyof typeof TIPO_LABELS;
export type EstadoRemateKey = keyof typeof ESTADO_LABELS;

export const TIPO_VALUES = Object.keys(TIPO_LABELS) as [TipoInmuebleKey, ...TipoInmuebleKey[]];
export const ESTADO_VALUES = Object.keys(ESTADO_LABELS) as [EstadoRemateKey, ...EstadoRemateKey[]];
