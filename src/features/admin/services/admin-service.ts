// Frontera del feature con el backend: todo acceso a Server Actions pasa por aquí.
export { logoutAction as logout } from "@/server/presentation/actions/auth-actions";
export {
  deleteRemateAction,
  setDestacadoAction,
  updateRemateAction,
  createRemateAction,
} from "@/server/presentation/actions/remate-actions";
export { deleteOrphanImagesAction } from "@/server/presentation/actions/image-actions";
export { createImageUploadsAction } from "@/server/presentation/actions/upload-actions";
export { setContactRequestReadAction } from "@/server/presentation/actions/contact-actions";
