const TOKEN_KEY = "token";
const REFRESH_KEY = "refreshToken";
const REMEMBER_KEY = "rememberMe";

export function getStorage() {
  const remember = localStorage.getItem(REMEMBER_KEY) === "1";
  return remember ? localStorage : sessionStorage;
}

export function setRememberMe(remember: boolean) {
  localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
}

export function saveAuthTokens(params: {
  token: string;
  refreshToken?: string;
  rememberMe: boolean;
}) {
  const { token, refreshToken, rememberMe } = params;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);

  setRememberMe(rememberMe);

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  if (refreshToken) storage.setItem(REFRESH_KEY, refreshToken);
}

export function readToken(): string | null {
  const preferred = getStorage().getItem(TOKEN_KEY);
  if (preferred) return preferred;
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function clearAuthTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}