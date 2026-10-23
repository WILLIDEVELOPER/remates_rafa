export interface StoredImageInfo {
  key: string;
  size: number;
  lastModified: Date;
}

export interface ImageStorage {
  /**
   * URL prefirmada para subir (PUT) un objeto directamente desde el navegador.
   * Queda atada al tipo y al tamaño exactos del archivo.
   */
  createUploadUrl(params: {
    key: string;
    contentType: string;
    size: number;
  }): Promise<string>;

  /** Todas las imágenes de remates que existen en el almacenamiento. */
  listImages(): Promise<StoredImageInfo[]>;

  /** Borra los objetos indicados; los que no existan se ignoran. */
  deleteImages(keys: string[]): Promise<void>;
}
