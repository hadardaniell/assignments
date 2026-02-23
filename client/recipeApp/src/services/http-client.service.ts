import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { getConfig, loadConfig } from "./config.service";

export type RequestData = Record<string, any> | undefined;

let api: ReturnType<typeof createApi> | null = null;

let isRefreshing = false;
let pendingRequests: ((token: string) => void)[] = [];

await loadConfig();

function createApi(client: AxiosInstance) {
  return {
    get<T>(url: string, params?: any, config?: AxiosRequestConfig) {
      return client.get<T>(url, { ...(config ?? {}), params }).then((r) => r.data);
    },
    post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
      return client.post<T>(url, data, config).then((r) => r.data);
    },
    put<T>(url: string, data?: RequestData, config?: AxiosRequestConfig) {
      return client.put<T>(url, data, config).then((r) => r.data);
    },
    delete<T>(url: string, config?: AxiosRequestConfig) {
      return client.delete<T>(url, config).then((r) => r.data);
    },
  };
}

const TOKEN_KEY = "token";
const REFRESH_KEY = "refreshToken";
const REMEMBER_KEY = "rememberMe";

function preferredStorage() {
  return localStorage.getItem(REMEMBER_KEY) === "1" ? localStorage : sessionStorage;
}

function readFromAnyStorage(key: string) {
  return (
    preferredStorage().getItem(key) ??
    localStorage.getItem(key) ??
    sessionStorage.getItem(key)
  );
}

function clearTokensEverywhere() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}

function saveTokens(token: string, refreshToken: string) {
  clearTokensEverywhere();
  const s = preferredStorage();
  s.setItem(TOKEN_KEY, token);
  s.setItem(REFRESH_KEY, refreshToken);
}

export async function initHttpClient() {
  if (api) return api;

  const { apiBaseUrl } = getConfig();

  const client = axios.create({
    baseURL: apiBaseUrl,
  });

  client.interceptors.request.use((config) => {
    // Content-Type
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete (config.headers as any)["Content-Type"];
        delete (config.headers as any)["content-type"];
      }
    } else {
      config.headers = config.headers ?? {};
      (config.headers as any)["Content-Type"] = "application/json";
    }

    // Authorization
    const token = readFromAnyStorage(TOKEN_KEY);
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve) => {
            pendingRequests.push((token) => {
              originalRequest.headers = originalRequest.headers ?? {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(client(originalRequest));
            });
          });
        }

        isRefreshing = true;

        try {
          const refreshToken = readFromAnyStorage(REFRESH_KEY);
          if (!refreshToken) throw new Error("No refresh token");

          const res = await client.post("/auth/refresh", { refreshToken });

          // ✅ תומך בשני פורמטים: {token, refreshToken} או {accessToken, refreshToken}
          const newAccess = res.data?.token ?? res.data?.accessToken;
          const newRefresh = res.data?.refreshToken;

          if (!newAccess || !newRefresh) throw new Error("Refresh response missing tokens");

          saveTokens(newAccess, newRefresh);

          pendingRequests.forEach((cb) => cb(newAccess));
          pendingRequests = [];

          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return client(originalRequest);
        } catch (e) {
          clearTokensEverywhere();
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  api = createApi(client);
  return api;
}

export function getApi() {
  if (!api) {
    throw new Error("HTTP client not initialized. Call initHttpClient() first.");
  }
  return api;
}