import {
  changePasswordAction,
  loginAction,
} from "@/server/presentation/actions/auth-actions";
import type { ChangePasswordFormValues } from "../schemas/change-password-schema";
import type { LoginFormValues } from "../schemas/login-schema";

export function login(values: LoginFormValues, next?: string) {
  return loginAction({ ...values, next });
}

export function changePassword({ currentPassword, newPassword }: ChangePasswordFormValues) {
  return changePasswordAction({ currentPassword, newPassword });
}
