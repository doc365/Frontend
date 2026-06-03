// ── Data source config ────────────────────────────────
// Priority: mock/local > backend
// Set USE_MOCK=false when backend is ready
export const USE_MOCK = true;
export const BASE_URL = "http://localhost:5293/api";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("mos_token");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `API error: ${res.status}`);
  }
  return res.json();
}

// Helper: use mock fn if USE_MOCK, else call backend
export async function dataSource(mockFn, backendFn) {
  if (USE_MOCK) return mockFn();
  return backendFn();
}
