export const ADMIN_TOKEN_KEY = "admin_access_token";

export const ADMIN_AUTH_API = "/api/admin/auth";
export const ADMIN_ANALYSIS_API = "/api/admin/analysis";

export function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}

export function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export function handleUnauthorized(response: Response) {
  if (response.status !== 401) {
    return;
  }

  clearAdminToken();
  window.location.reload();
  throw new Error("Unauthorized");
}

export async function fetchAdminJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });

  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchAdminResponse(url: string): Promise<Response> {
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });

  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response;
}

