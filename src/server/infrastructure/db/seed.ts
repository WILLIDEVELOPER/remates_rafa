import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { generateSlug, type Remate } from "../../domain/entities/remate.ts";
import { remates, type NewRemateRow } from "./schema.ts";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL no está definida");
}

const db = drizzle(neon(databaseUrl));

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

const IMG = {
  casaModerna: unsplash("1564013799919-ab600027ffc6"),
  casaClasica: unsplash("1568605114967-8130f3a36994"),
  villa: unsplash("1512917774080-9991f1c4c750"),
  edificio: unsplash("1545324418-cc1a3fa10c00"),
  casaJardin: unsplash("1600585154340-be6161a56a0c"),
  interior: unsplash("1560448204-e02f11c3d0e2"),
  casaLadrillo: unsplash("1570129477492-45c003edd2be"),
  mansion: unsplash("1580587771525-78b9dba3b914"),
  sala: unsplash("1502672260266-1c1ef2d93688"),
  comercial: unsplash("1486406146926-c627a92ad1ab"),
  campo: unsplash("1500382017468-9049fed747ef"),
  casaBlanca: unsplash("1523217582562-09d0def993a6"),
  casaPiscina: unsplash("1600596542815-ffad4c1539a9"),
  industrial: unsplash("1605276374104-dee2a0ed3cd6"),
  salaEstar: unsplash("1493809842364-78817add7ffb"),
  fachada: unsplash("1600607687939-ce8a6c25118c"),
};

const inDays = (days: number) => new Date(Date.now() + days * 86_400_000);

type SeedRemate = Pick<
  Remate,
  | "nombre"
  | "descripcion"
  | "departamento"
  | "ciudad"
  | "municipio"
  | "direccion"
  | "tipoInmueble"
  | "precioBase"
  | "precioComercial"
  | "area"
  | "habitaciones"
  | "banos"
  | "estado"
  | "fechaRemate"
  | "imagenes"
  | "destacado"
>;

const seedRemates: SeedRemate[] = [
  {
    nombre: "Casa campestre en El Poblado",
    descripcion:
      "Amplia casa de tres niveles en uno de los sectores más valorizados de Medellín. Cuenta con terraza, zona BBQ, estudio y parqueadero para tres vehículos. Remate por orden judicial con saneamiento jurídico completo.",
    departamento: "Antioquia",
    ciudad: "Medellín",
    municipio: "Medellín",
    direccion: "Sector Los Balsos, El Poblado",
    tipoInmueble: "casa",
    precioBase: 780_000_000,
    precioComercial: 1_150_000_000,
    area: 320,
    habitaciones: 4,
    banos: 4,
    estado: "disponible",
    fechaRemate: inDays(21),
    imagenes: [IMG.casaModerna, IMG.interior, IMG.salaEstar],
    destacado: true,
  },
  {
    nombre: "Apartamento con vista en Envigado",
    descripcion:
      "Apartamento en piso 12 con balcón, cocina integral y zonas comunes con gimnasio y piscina. Excelente ubicación cerca de centros comerciales y vías principales.",
    departamento: "Antioquia",
    ciudad: "Medellín",
    municipio: "Envigado",
    direccion: "Calle 37 Sur con Carrera 43A",
    tipoInmueble: "apartamento",
    precioBase: 310_000_000,
    precioComercial: 450_000_000,
    area: 92,
    habitaciones: 3,
    banos: 2,
    estado: "disponible",
    fechaRemate: inDays(35),
    imagenes: [IMG.edificio, IMG.sala],
    destacado: true,
  },
  {
    nombre: "Casa en Chía, conjunto cerrado",
    descripcion:
      "Casa de dos pisos en conjunto cerrado con vigilancia 24 horas, zonas verdes y salón social. Ideal para vivienda familiar a pocos minutos de Bogotá.",
    departamento: "Cundinamarca",
    ciudad: "Chía",
    municipio: "Chía",
    direccion: "Vereda Fonquetá",
    tipoInmueble: "casa",
    precioBase: 540_000_000,
    precioComercial: 780_000_000,
    area: 180,
    habitaciones: 3,
    banos: 3,
    estado: "disponible",
    fechaRemate: inDays(28),
    imagenes: [IMG.casaBlanca, IMG.interior],
    destacado: true,
  },
  {
    nombre: "Apartamento en Chapinero Alto",
    descripcion:
      "Apartamento remodelado en edificio con ascensor y portería. A una cuadra de transporte público, universidades y zona gastronómica.",
    departamento: "Bogotá D.C.",
    ciudad: "Bogotá",
    municipio: "Chapinero",
    direccion: "Carrera 4 con Calle 58",
    tipoInmueble: "apartamento",
    precioBase: 360_000_000,
    precioComercial: 520_000_000,
    area: 78,
    habitaciones: 2,
    banos: 2,
    estado: "disponible",
    fechaRemate: inDays(14),
    imagenes: [IMG.sala, IMG.salaEstar],
    destacado: true,
  },
  {
    nombre: "Local comercial sobre vía principal en Suba",
    descripcion:
      "Local de esquina con alto flujo peatonal y vehicular, doble altura y mezanine. Uso comercial permitido, con baño y depósito.",
    departamento: "Bogotá D.C.",
    ciudad: "Bogotá",
    municipio: "Suba",
    direccion: "Avenida Suba con Calle 127",
    tipoInmueble: "local",
    precioBase: 420_000_000,
    precioComercial: 600_000_000,
    area: 110,
    habitaciones: null,
    banos: 2,
    estado: "disponible",
    fechaRemate: inDays(42),
    imagenes: [IMG.comercial],
    destacado: false,
  },
  {
    nombre: "Casa con piscina en Ciudad Jardín, Cali",
    descripcion:
      "Casa de un nivel con patio, piscina y amplio garaje en barrio residencial tradicional del sur de Cali. Escritura y libertad de gravámenes al día.",
    departamento: "Valle del Cauca",
    ciudad: "Cali",
    municipio: "Cali",
    direccion: "Barrio Ciudad Jardín",
    tipoInmueble: "casa",
    precioBase: 690_000_000,
    precioComercial: 940_000_000,
    area: 260,
    habitaciones: 4,
    banos: 3,
    estado: "disponible",
    fechaRemate: inDays(30),
    imagenes: [IMG.casaPiscina, IMG.fachada],
    destacado: true,
  },
  {
    nombre: "Bodega industrial en Yumbo",
    descripcion:
      "Bodega en zona industrial con muelle de cargue, oficinas administrativas y patio de maniobras. Cercana a la vía Cali–Yumbo.",
    departamento: "Valle del Cauca",
    ciudad: "Cali",
    municipio: "Yumbo",
    direccion: "Zona Industrial Arroyohondo",
    tipoInmueble: "bodega",
    precioBase: 1_250_000_000,
    precioComercial: 1_700_000_000,
    area: 900,
    habitaciones: null,
    banos: 4,
    estado: "disponible",
    fechaRemate: inDays(50),
    imagenes: [IMG.industrial],
    destacado: false,
  },
  {
    nombre: "Casa familiar en Puerto Colombia",
    descripcion:
      "Casa de dos niveles a pocos minutos de la playa, con patio, terraza y cuarto de servicio. Zona en constante valorización.",
    departamento: "Atlántico",
    ciudad: "Barranquilla",
    municipio: "Puerto Colombia",
    direccion: "Urbanización Pradomar",
    tipoInmueble: "casa",
    precioBase: 410_000_000,
    precioComercial: 590_000_000,
    area: 200,
    habitaciones: 4,
    banos: 3,
    estado: "adjudicado",
    fechaRemate: inDays(-10),
    imagenes: [IMG.casaClasica, IMG.casaJardin],
    destacado: false,
  },
  {
    nombre: "Apartamento en el Centro Histórico de Cartagena",
    descripcion:
      "Apartamento en edificio patrimonial con balcón colonial, techos altos y piscina en terraza. Alto potencial de renta turística.",
    departamento: "Bolívar",
    ciudad: "Cartagena",
    municipio: "Cartagena",
    direccion: "Calle del Arsenal, Getsemaní",
    tipoInmueble: "apartamento",
    precioBase: 590_000_000,
    precioComercial: 850_000_000,
    area: 85,
    habitaciones: 2,
    banos: 2,
    estado: "disponible",
    fechaRemate: inDays(18),
    imagenes: [IMG.edificio, IMG.salaEstar],
    destacado: true,
  },
  {
    nombre: "Lote urbanizable en Floridablanca",
    descripcion:
      "Lote plano con servicios públicos en el borde de la vía principal, apto para proyecto residencial o comercial. Con licencia de urbanismo vigente.",
    departamento: "Santander",
    ciudad: "Bucaramanga",
    municipio: "Floridablanca",
    direccion: "Anillo vial Floridablanca–Piedecuesta",
    tipoInmueble: "lote",
    precioBase: 280_000_000,
    precioComercial: 400_000_000,
    area: 1_200,
    habitaciones: null,
    banos: null,
    estado: "disponible",
    fechaRemate: inDays(60),
    imagenes: [IMG.campo],
    destacado: false,
  },
  {
    nombre: "Finca de recreo en Rionegro",
    descripcion:
      "Finca con casa principal, casa de huéspedes, zona de cultivos y vista a la montaña. A 15 minutos del aeropuerto José María Córdova.",
    departamento: "Antioquia",
    ciudad: "Rionegro",
    municipio: "El Retiro",
    direccion: "Vereda Don Diego",
    tipoInmueble: "finca",
    precioBase: 950_000_000,
    precioComercial: 1_400_000_000,
    area: 8_000,
    habitaciones: 5,
    banos: 4,
    estado: "disponible",
    fechaRemate: inDays(45),
    imagenes: [IMG.mansion, IMG.campo, IMG.casaLadrillo],
    destacado: true,
  },
  {
    nombre: "Casa lote en Fusagasugá",
    descripcion:
      "Casa campestre con amplio jardín y clima cálido todo el año, a una hora de Bogotá. Ideal para descanso o vivienda permanente.",
    departamento: "Cundinamarca",
    ciudad: "Fusagasugá",
    municipio: "Silvania",
    direccion: "Vereda Subia",
    tipoInmueble: "casa",
    precioBase: 330_000_000,
    precioComercial: 470_000_000,
    area: 450,
    habitaciones: 3,
    banos: 2,
    estado: "suspendido",
    fechaRemate: null,
    imagenes: [IMG.casaJardin, IMG.casaLadrillo],
    destacado: false,
  },
];

const rows: NewRemateRow[] = seedRemates.map((r) => ({
  ...r,
  slug: generateSlug(r.nombre),
  precioBase: String(r.precioBase),
  precioComercial: r.precioComercial === null ? null : String(r.precioComercial),
  area: String(r.area),
  imagenPrincipal: r.imagenes[0] ?? null,
}));

const inserted = await db
  .insert(remates)
  .values(rows)
  .onConflictDoNothing({ target: remates.slug })
  .returning({ slug: remates.slug });

console.log(
  `Seed: ${inserted.length} remates insertados, ${rows.length - inserted.length} ya existían.`,
);
