// ── Data source config ────────────────────────────────
// Set USE_MOCK=false to use the real backend
export const USE_MOCK = false;
export const BASE_URL = "https://localhost:7182/api/v1";

export async function apiFetch(endpoint, options = {}, skipAuth) {
  const token = localStorage.getItem("mos_token");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `API error: ${res.status}`);
  }

  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Helper: use mock fn if USE_MOCK, else call backend
export async function dataSource(mockFn, backendFn) {
  if (USE_MOCK) return mockFn();
  return backendFn();
}