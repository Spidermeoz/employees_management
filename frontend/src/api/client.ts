// src/api/client.ts
const API_BASE_URL = "http://127.0.0.1:3000"; // backend FastAPI

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    full_name: string;
    email: string;
    role: string;
  };
}

/* =======================
   AUTH HEADER
======================= */
function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
}

/* =======================
   GLOBAL RESPONSE HANDLER
======================= */
async function handleResponse<T>(res: Response): Promise<T> {
  // ❌ Unauthorized → logout + redirect
  if (res.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("current_user");

    // Ép về trang login
    window.location.href = "/login";

    throw new Error("Unauthorized");
  }

  // ❌ Other errors
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `Request failed (${res.status})`);
  }

  // ✅ OK
  return res.json();
}

/* =======================
   HTTP METHODS
======================= */
export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  return handleResponse<T>(res);
}

export async function apiPost<T>(url: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}

export async function apiPut<T>(url: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}

export async function apiDelete(url: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  await handleResponse(res);
}

/* =======================
   LOGIN API
======================= */
export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  return apiPost<LoginResponse>("/auth/login", payload);
}
