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
      return client.get<T>(url, { ...(config ?? {}), params }).then(r => r.data);
    },
    post<T>(url: string, data?: RequestData, config?: AxiosRequestConfig) {
      return client.post<T>(url, data).then(r => r.data);
    },
    put<T>(url: string, data?: RequestData, config?: AxiosRequestConfig) {
      return client.put<T>(url, data, config).then(r => r.data);
    },
    delete<T>(url: string, config?: AxiosRequestConfig) {
      return client.delete<T>(url, config).then(r => r.data);
    },
  };
}

export async function initHttpClient() {
  if (api) return api;

  const { apiBaseUrl } = getConfig();

  const client = axios.create({
    baseURL: apiBaseUrl,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
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

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve) => {
            pendingRequests.push((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(client(originalRequest));
            });
          });
        }

        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("No refresh token");

          const res = await client.post("/auth/refresh", { refreshToken });

          const { accessToken, refreshToken: newRefreshToken } = res.data;

          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          pendingRequests.forEach((cb) => cb(accessToken));
          pendingRequests = [];

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return client(originalRequest);
        } catch (e) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
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
