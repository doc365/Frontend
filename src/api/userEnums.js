// ── User enum maps (API ↔ UI) ─────────────────────────────────────────────────

// API role int → display string
export const ROLE_MAP = {
  1: "Administrator",
  2: "Tenant Administrator",
  3: "Tenant User",
};

// Display string → API role int (for create/update)
export const ROLE_TO_INT = {
  "Administrator": 1,
  "Tenant Administrator": 2,
  "Tenant User": 3,
};

// API status int → display string
// Status 3 = soft-deleted — we never show these in the UI
export const STATUS_MAP = {
  1: "Active",
  2: "Inactive",
  3: "Deleted",
};

// Display string → API status int
export const STATUS_TO_INT = {
  "Active": 1,
  "Inactive": 2,
};

// Filter values for StatusFilter query param (1-based, matches API)
export const STATUS_FILTER = {
  Active: 1,
  Inactive: 2,
  Deleted: 3,
};

// Filter values for RoleFilter query param (1-based, NOT same as stored role int)
export const ROLE_FILTER = {
  Administrator: 1,
  TenantAdministrator: 2,
  TenantUser: 3,
};

// Normalize a raw API user object to the shape the UI expects
const SIGNIN_METHOD_MAP = {
  0: "Local",
  1: "Microsoft",
  2: "Google",
};

export function normalizeUser(apiUser) {
  return {
    id: apiUser.id,
    userId: apiUser.userId,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone ?? "",
    role: ROLE_MAP[apiUser.role] ?? "Tenant User",
    roleInt: apiUser.role,
    status: STATUS_MAP[apiUser.status] ?? "Active",
    statusInt: apiUser.status,
    productNames: apiUser.productNames ?? [],
    temporaryPassword: apiUser.temporaryPassword ?? null,
    fullName: apiUser.name,
    signInMethod:     apiUser.signinMethod, 
    signInMethodInt: apiUser.signinMethod,
    staffId: "",
    sex: "",
    lastLogin: "",
    createdAt: "",
    productAssignments: [],
  };
}