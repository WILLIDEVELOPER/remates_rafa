import { loginAction } from "@/server/presentation/actions/auth-actions";
import type { LoginFormValues } from "../schemas/login-schema";

export function login(values: LoginFormValues, next?: string) {
  return loginAction({ ...values, next });
}
