import { invalid, valid, type Checked } from "./checked.ts";

// Módulo puro (sin imports de otras capas): lo usan el servidor, que es quien hace
// cumplir las reglas, y los formularios, para avisar antes de enviar.

export const NOMBRE_MAX = 80;
export const COMENTARIO_MIN = 10;
export const COMENTARIO_MAX = 1000;

// ---------------------------------------------------------------------------
// Lenguaje inapropiado
// ---------------------------------------------------------------------------

/** Sin tildes (la ñ se conserva). Cada letra admite alargamiento: "puuuta" también coincide. */
const BAD_WORDS = [
  // Insultos y groserías
  "puta", "puto", "puteria", "putear", "hijueputa", "hijoputa", "hijaputa", "hijuepucha", "jueputa",
  "malparido", "malparida", "marica", "maricon", "mierda", "cabron", "cabrona", "pendejo", "pendeja",
  "gonorrea", "culo", "verga", "pija", "chucha", "joder", "jodido", "jodida", "carajo", "coño",
  "cojones", "huevon", "huevona", "gilipollas", "capullo", "zorra",
  // Ofensas hacia las personas
  "imbecil", "idiota", "estupido", "estupida", "retrasado", "retrasada", "retardado", "subnormal",
  "mongolico", "sudaca", "nazi",
  // Contenido sexual
  "follar", "porno", "pornografia",
  // Inglés
  "fuck", "fucking", "fucker", "motherfucker", "shit", "shitty", "bitch", "asshole", "bastard",
  "dick", "pussy", "cunt", "nigger", "nigga", "faggot", "whore", "slut", "porn",
];

const stretch = (word: string) => [...word].map((letter) => `${letter}+`).join("");

const BAD_WORD_RE = new RegExp(
  `^(?:${BAD_WORDS.map(stretch).join("|")})(?:s|es|ita|ito|itas|itos|azo|azos)?$`,
  "u",
);

const THREAT_RE =
  /\b(?:(?:te|lo|la|los|las|nos)\s+(?:voy|vamos|van)\s+a\s+(?:matar|asesinar|violar|secuestrar|quemar|golpear)|matarte|matarlos|matarlo|matarla)\b/;

/** Letras sueltas separadas por espacios o signos: "p u t a", "p.u.t.a". */
const SPACED_LETTERS_RE =
  /(?<![\p{L}\p{N}])(?:[\p{L}\d@$][\s.\-_*,]+){2,}[\p{L}\d@$](?![\p{L}\p{N}])/gu;

const LEET: Record<string, string> = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", $: "s",
};

/** Minúsculas y sin tildes, pero conservando la ñ ("coño" no es "cono"). */
function fold(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/ñ/g, "ñ")
    .replace(/[̀-ͯ]/g, "");
}

/** "m13rd4" -> "mierda". Solo se aplica a palabras con letras, para no tocar cifras ni precios. */
function unleet(token: string): string {
  return /\p{L}/u.test(token) ? token.replace(/[013457@$]/g, (char) => LEET[char]) : token;
}

/** Groserías, insultos, amenazas y trucos para disfrazarlos (números, espacios, asteriscos). */
export function containsInappropriate(text: string): boolean {
  const folded = fold(text);

  // "put*", "m*erda": censurar con asteriscos sigue siendo decir la palabra.
  if (/\p{L}\*/u.test(folded)) return true;
  if (THREAT_RE.test(folded)) return true;

  const tokens = folded.split(/[^\p{L}\p{N}@$]+/u).filter(Boolean);
  if (tokens.some((token) => BAD_WORD_RE.test(unleet(token)))) return true;

  for (const match of folded.matchAll(SPACED_LETTERS_RE)) {
    const joined = match[0].replace(/[\s.\-_*,]+/g, "");
    if (BAD_WORD_RE.test(unleet(joined))) return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// Texto sin sentido
// ---------------------------------------------------------------------------

const KEYBOARD_MASH =
  /asdf|sdfg|dfgh|fghj|ghjk|hjkl|qwer|wert|erty|rtyu|tyui|yuio|uiop|zxcv|xcvb|cvbn|vbnm|qazw|wsxe/;

const VOWELS = /[aeiouyáéíóúüàèìòù]/i;

function lettersOf(word: string): string {
  return word.replace(/[^\p{L}]/gu, "").toLowerCase();
}

/** Palabra que no parece de ningún idioma: sin vocales, teclado aporreado o letra repetida. */
function isGibberish(word: string, minLengthWithoutVowels: number, maxRun: number): boolean {
  const letters = lettersOf(word);
  if (KEYBOARD_MASH.test(letters)) return true;
  if (letters.length >= minLengthWithoutVowels && !VOWELS.test(letters)) return true;
  return new RegExp(`(.)\\1{${maxRun},}`, "u").test(letters);
}

// ---------------------------------------------------------------------------
// Nombre
// ---------------------------------------------------------------------------

const NAME_WORD_RE = /^[\p{Script=Latin}\p{M}]+(?:['’-][\p{Script=Latin}\p{M}]+)*\.?$/u;

export function checkNombre(raw: string): Checked<string> {
  const nombre = raw.normalize("NFC").trim().replace(/\s+/g, " ");

  if (!nombre) return invalid("Ingresa tu nombre.");
  if (nombre.length < 2) return invalid("El nombre es demasiado corto.");
  if (nombre.length > NOMBRE_MAX) return invalid("El nombre es demasiado largo.");

  const words = nombre.split(" ");
  if (!words.every((word) => NAME_WORD_RE.test(word))) {
    return invalid("El nombre solo puede tener letras, espacios, guiones y apóstrofes.");
  }
  if (!words.some((word) => lettersOf(word).length >= 2)) {
    return invalid("Ingresa un nombre válido.");
  }
  if (words.some((word) => isGibberish(word, 4, 2))) {
    return invalid("Ingresa tu nombre real.");
  }
  if (containsInappropriate(nombre)) {
    return invalid("El nombre contiene lenguaje inapropiado.");
  }

  return valid(nombre);
}

// ---------------------------------------------------------------------------
// Reseña
// ---------------------------------------------------------------------------

const LINK_RE =
  /https?:\/\/|www\.|\b(?:bit\.ly|t\.me|wa\.me|tinyurl\.com)\b|\b[a-z0-9-]+\.(?:com|net|org|info|biz|io|me|ly|xyz|top|click|link|ru|cn|tk|ml|ga|cf|gq|app|shop|site|online|co)\b(?:\/|\b)/i;

const EMAIL_IN_TEXT_RE = /[\w.+-]+\s?@\s?[\w-]+\.[\w.-]+/;
const HANDLE_RE = /(?:^|\s)@\w{3,}/;
/** Celular colombiano escrito con o sin separadores, con o sin +57. */
const PHONE_IN_TEXT_RE = /(?:\+?57[\s.-]?)?\b3[0-5]\d[\s.-]?\d{3}[\s.-]?\d{4}\b/;

const SPAM_RE =
  /viagra|cialis|casino|forex|bitcoin|criptomoneda|apuestas|gana(?:r)?\s+dinero|dinero\s+facil|click\s+aqui|haz\s+clic|siguenos|sigueme|suscribete|oferta\s+exclusiva|prestamos?\s+(?:rapidos?|inmediatos?)|inversion\s+segura/;

const EMOJI_RE = /[\p{Extended_Pictographic}\p{Regional_Indicator}️]/u;
const NON_LATIN_LETTER_RE = /(?![\p{Script=Latin}])\p{L}/u;
const HIDDEN_CHARS_RE = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u;

/** Espacios y saltos de línea ordenados, sin cambiar las palabras. */
export function normalizeText(raw: string): string {
  return raw
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function checkComentario(raw: string): Checked<string> {
  const text = normalizeText(raw);

  if (!text) return invalid("Escribe tu reseña.");
  if (text.length < COMENTARIO_MIN) {
    return invalid(`Cuéntanos un poco más (mínimo ${COMENTARIO_MIN} caracteres).`);
  }
  if (text.length > COMENTARIO_MAX) {
    return invalid(`La reseña no puede superar ${COMENTARIO_MAX} caracteres.`);
  }

  if (/[<>]/.test(text) || HIDDEN_CHARS_RE.test(text.replace(/\n/g, ""))) {
    return invalid("La reseña contiene caracteres no permitidos.");
  }
  if (EMOJI_RE.test(text)) return invalid("No se permiten emojis ni símbolos especiales.");
  if (NON_LATIN_LETTER_RE.test(text)) return invalid("Escribe tu reseña en español.");

  const folded = fold(text);
  if (LINK_RE.test(folded)) return invalid("No incluyas enlaces ni direcciones web.");
  if (EMAIL_IN_TEXT_RE.test(folded) || HANDLE_RE.test(folded) || PHONE_IN_TEXT_RE.test(folded)) {
    return invalid(
      "No incluyas correos, teléfonos ni usuarios de redes sociales: tus datos de contacto ya los recibimos.",
    );
  }
  if (SPAM_RE.test(folded)) {
    return invalid("Tu reseña parece publicidad. Cuéntanos tu experiencia con este remate.");
  }
  if (containsInappropriate(text)) {
    return invalid("Tu reseña contiene lenguaje inapropiado. Escríbela de forma respetuosa.");
  }

  const words = text.split(/[^\p{L}\p{N}'’-]+/u).filter((word) => /\p{L}/u.test(word));
  if (words.length < 3) return invalid("Escribe al menos 3 palabras.");
  if (words.some((word) => word.length > 30 || isGibberish(word, 5, 3))) {
    return invalid("Escribe tu reseña con palabras reales.");
  }
  if (/([\p{L}\p{N}])\1{3,}/u.test(text) || /([^\p{L}\p{N}\s])\1{4,}/u.test(text)) {
    return invalid("Evita repetir letras, números o signos muchas veces seguidas.");
  }
  if (/(?<!\p{L})(\p{L}+)(?:\s+\1(?!\p{L})){3,}/iu.test(text)) {
    return invalid("Evita repetir la misma palabra una y otra vez.");
  }

  const letters = text.match(/\p{L}/gu) ?? [];
  const uppercase = text.match(/\p{Lu}/gu) ?? [];
  if (letters.length >= 20 && uppercase.length / letters.length > 0.6) {
    return invalid("Evita escribir todo en mayúsculas.");
  }

  return valid(text);
}
