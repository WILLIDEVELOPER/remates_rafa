export interface ImageUploadRequest {
  name: string;
  contentType: string;
  size: number;
}

export interface ImageUploadTarget {
  /** Referencia que se guarda en `Remate.imagenes`. */
  key: string;
  uploadUrl: string;
  contentType: string;
}
