import { httpClient } from '../../services/http-client.service';
import type { LoginDTO, RegisterDTO, User } from './auth.types'

export const authApi = {
  login: (data: LoginDTO) => httpClient.post<User>('/auth/login', data),
  register: (data: RegisterDTO) => httpClient.post<User>('/auth/register', data),
}
