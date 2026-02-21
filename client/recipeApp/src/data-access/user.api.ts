import type { SafeUser } from "../types/user.types";
import { getApi } from "../services/http-client.service";

type UpdateUserDTO = {
  name: string;
  avatarUrl?: string | null;
};

export const usersApi = {
  updateUser: async (id: string, body: UpdateUserDTO) => {
    const res = await getApi().put<SafeUser>(`/users/updateUser/${id}`, body);
    return res;
  },
  uploadUserAvatar: (userId: string, file: File) => {
    const fd = new FormData();
    fd.append("profile_image", file);
    return getApi().post<{ url: string }>(`/users/${userId}/uploadAvatar`, fd);
  },
};
