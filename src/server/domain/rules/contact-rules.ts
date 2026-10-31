import { invalid, valid, type Checked } from "./checked.ts";

// Módulo puro: lo comparten el servidor (que hace cumplir las reglas) y los formularios.

// ---------------------------------------------------------------------------
// Correo
// ---------------------------------------------------------------------------

const EMAIL_RE =
  /^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;

/** Dominios de correo temporal: la persona no volvería a leer nada que le enviemos. */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "10minutemail.com",
  "tempmail.com", "temp-mail.org", "tempmailo.com", "yopmail.com", "trashmail.com", "getnada.com",
  "maildrop.cc", "dispostable.com", "fakeinbox.com", "mohmal.com", "emailondeck.com", "mintemail.com",
  "throwawaymail.com",
]);

/** Dominios de ejemplo o de relleno (incluye el del texto de ayuda del formulario). */
const PLACEHOLDER_DOMAINS = new Set(["example.com", "example.org", "test.com", "correo.com", "dominio.com"]);

/** Errores de tipeo frecuentes y el dominio que seguramente quisieron escribir. */
const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmaill.com": "gmail.com",
  "gmail.con": "gmail.com", "gmail.cm": "gmail.com", "gnail.com": "gmail.com", "gamil.com": "gmail.com",
  "hotmial.com": "hotmail.com", "hotmal.com": "hotmail.com", "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com", "outlook.con": "outlook.com",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.con": "yahoo.com",
  "icloud.con": "icloud.com",
};

export function checkEmail(raw: string): Checked<string> {
  const email = raw.trim().toLowerCase();

  if (!email) return invalid("Ingresa tu correo electrónico.");
  if (email.length > 254) return invalid("El correo electrónico es demasiado largo.");

  const message = "Ingresa un correo electrónico válido, por ejemplo nombre@gmail.com.";
  if (!EMAIL_RE.test(email) || email.includes("..")) return invalid(message);

  const [local, domain] = email.split("@");
  if (/(.)\1{5,}/.test(local)) return invalid(message);

  const suggestion = DOMAIN_TYPOS[domain];
  if (suggestion) return invalid(`¿Quisiste decir ${local}@${suggestion}?`);
  if (PLACEHOLDER_DOMAINS.has(domain) || DISPOSABLE_DOMAINS.has(domain)) {
    return invalid("Usa un correo real que revises con frecuencia.");
  }

  return valid(email);
}

// ---------------------------------------------------------------------------
// Teléfono
// ---------------------------------------------------------------------------

const PHONE_MESSAGE =
  "Ingresa un número de teléfono válido, por ejemplo 311 482 6905 o +57 311 482 6905.";

/** Celular (30x–35x) o fijo con indicativo (601–608), sin el 57 de país. */
const CO_NATIONAL_RE = /^(?:3[0-5]\d{8}|60[1-8]\d{7})$/;

/** Rachas de 7 dígitos consecutivos ascendentes o descendentes ("1234567", "9876543"). */
function hasSequentialRun(digits: string, length = 7): boolean {
  let up = 1;
  let down = 1;
  for (let i = 1; i < digits.length; i++) {
    const step = Number(digits[i]) - Number(digits[i - 1]);
    up = step === 1 ? up + 1 : 1;
    down = step === -1 ? down + 1 : 1;
    if (up >= length || down >= length) return true;
  }
  return false;
}

/** Números inventados: todo el mismo dígito, muchos repetidos seguidos o secuencias. */
function looksFake(digits: string): boolean {
  return /^(\d)\1+$/.test(digits) || /(\d)\1{5,}/.test(digits) || hasSequentialRun(digits);
}

function formatColombian(national: string): string {
  return `+57 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
}

/**
 * Acepta celulares y fijos colombianos (con o sin +57) y números internacionales con "+".
 * Devuelve el número normalizado: `+57 300 123 4567` o `+<país><número>`.
 */
export function checkPhone(raw: string): Checked<string> {
  const cleaned = raw.trim().replace(/[\s().-]/g, "");

  if (!cleaned) return invalid("Ingresa tu número de teléfono.");
  if (!/^\+?\d+$/.test(cleaned)) return invalid(PHONE_MESSAGE);

  let digits = cleaned.replace(/^\+/, "");
  let international = cleaned.startsWith("+");
  if (!international && digits.startsWith("00")) {
    digits = digits.slice(2);
    international = true;
  }

  if (international && !digits.startsWith("57")) {
    if (!/^[1-9]\d{7,14}$/.test(digits) || looksFake(digits)) return invalid(PHONE_MESSAGE);
    return valid(`+${digits}`);
  }

  const national = international || (digits.length === 12 && digits.startsWith("57"))
    ? digits.slice(2)
    : digits;

  if (!CO_NATIONAL_RE.test(national) || looksFake(national)) return invalid(PHONE_MESSAGE);

  return valid(formatColombian(national));
}
