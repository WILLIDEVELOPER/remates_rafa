export interface OrphanImageDto {
  key: string;
  /** URL para mostrar la vista previa. */
  url: string;
  /** Bytes. */
  size: number;
  /** ISO 8601 */
  lastModified: string;
}

export interface ListOrphanImagesOutput {
  items: OrphanImageDto[];
  /** Espacio total que ocupan las huérfanas, en bytes. */
  totalBytes: number;
  /** Imágenes sin remate pero subidas hace poco: no se listan por si se están usando en un formulario abierto. */
  recentCount: number;
  /** Antigüedad mínima (minutos) para considerar huérfana una imagen. */
  minAgeMinutes: number;
}

export interface DeleteOrphanImagesOutput {
  deleted: number;
  /** Claves que no se borraron porque ya no son huérfanas, son recientes o no existen. */
  skipped: number;
  freedBytes: number;
}
