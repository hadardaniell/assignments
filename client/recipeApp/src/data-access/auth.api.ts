import type { AuthResponse, LoginDTO, RegisterDTO, User } from "../types/auth.types";
import { getApi } from "../services/http-client.service";

export const authApi = {
  me: () => getApi().get<User>("/auth/me"),
  login: (data: LoginDTO) => getApi().post<AuthResponse>("/auth/login", data),
  register: (data: RegisterDTO) => getApi().post<AuthResponse>("/auth/register", data),

  refresh: () =>
    getApi().post<AuthResponse>("/auth/refresh", {
      refreshToken: localStorage.getItem("refreshToken"),
    }),
};
