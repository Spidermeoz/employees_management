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

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error(`GET ${url} failed (${res.status})`);
  }

  return res.json();
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

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `POST ${url} failed (${res.status})`);
  }

  return res.json();
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

  if (!res.ok) {
    throw new Error(`PUT ${url} failed (${res.status})`);
  }

  return res.json();
}

export async function apiDelete(url: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error(`DELETE ${url} failed (${res.status})`);
  }
}

// API login dùng riêng
export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  return apiPost<LoginResponse>("/auth/login", payload);
}
