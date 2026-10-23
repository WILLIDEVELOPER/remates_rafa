const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const compactCurrency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  notation: "compact",
  maximumFractionDigits: 1,
});

const longDate = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "long",
  timeZone: "America/Bogota",
});

const area = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 });

export function formatCOP(value: number): string {
  return currency.format(value);
}

export function formatCompactCOP(value: number): string {
  return compactCurrency.format(value);
}

export function formatDate(value: string | Date): string {
  return longDate.format(typeof value === "string" ? new Date(value) : value);
}

const dateTime = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Bogota",
});

export function formatDateTime(value: string | Date): string {
  return dateTime.format(typeof value === "string" ? new Date(value) : value);
}

/** Duración en minutos legible: "45 min", "1 h", "90 min". */
export function formatMinutes(minutes: number): string {
  const value = Math.max(0, Math.round(minutes));
  return value >= 60 && value % 60 === 0 ? `${value / 60} h` : `${value} min`;
}

/** Tamaño de archivo legible: 512 B, 84 KB, 2,3 MB. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toLocaleString("es-CO", { maximumFractionDigits: value >= 10 ? 0 : 1 })} ${units[unit]}`;
}

export function formatArea(value: number): string {
  return `${area.format(value)} m²`;
}

/** Formatea un celular colombiano de 10 dígitos como `+57 XXX XXX XXXX`. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^57(?=\d{10}$)/, "");
  if (digits.length !== 10) return raw;
  return `+57 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

/** "Municipio, Ciudad, Departamento" sin repetir nombres iguales (p. ej. Cali, Cali). */
export function formatLocation(parts: string[]): string {
  return parts.filter((part, index) => part && parts.indexOf(part) === index).join(", ");
}

/** Descuento del precio base frente al comercial, en porcentaje entero. */
export function discountPercent(base: number, commercial: number | null): number | null {
  if (!commercial || commercial <= base) return null;
  return Math.round((1 - base / commercial) * 100);
}
