import type { AuthResponse, LoginDTO, RegisterDTO } from "./auth.types";
import { getApi } from "../../services/http-client.service";

export const authApi = {
  login: (data: LoginDTO) => getApi().post<AuthResponse>("/auth/login", data),
  register: (data: RegisterDTO) => getApi().post<AuthResponse>("/auth/register", data),
};
