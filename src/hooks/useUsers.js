import { useState, useCallback } from "react";
import { MOCK_USERS } from "../mock/data";
import { useNotifications } from "../context/NotificationContext";
import { dataSource, apiFetch } from "../api/config";
import {
  normalizeUser,
  ROLE_TO_INT,
  ROLE_FILTER,
  STATUS_FILTER,
} from "../api/userEnums";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const { addNotification } = useNotifications();

  // ── Fetch list ───────────────────────────────────────
  const fetchUsers = useCallback(
    async ({
      page = 1,
      pageSize = 10,
      search = "",
      sortField = "name",
      sortOrder = "asc",
      filters = {},
    } = {}) => {
      setLoading(true);
      setError(null);
      try {
        await dataSource(
          // ── Mock ──
          async () => {
            await new Promise((r) => setTimeout(r, 300));
            let filtered = [...MOCK_USERS];

            if (search) {
              const q = search.toLowerCase();
              filtered = filtered.filter(
                (u) =>
                  u.name.toLowerCase().includes(q) ||
                  u.email.toLowerCase().includes(q) ||
                  u.userId.toLowerCase().includes(q),
              );
            }
            if (filters.signInMethod?.length)
              filtered = filtered.filter((u) =>
                filters.signInMethod.includes(u.signInMethod),
              );
            if (filters.role?.length)
              filtered = filtered.filter((u) => filters.role.includes(u.role));
            if (filters.status?.length)
              filtered = filtered.filter((u) =>
                filters.status.includes(u.status),
              );
            if (filters.product?.length)
              filtered = filtered.filter((u) =>
                u.productAssignments?.some((a) =>
                  filters.product.includes(a.productId),
                ),
              );
            if (filters.roleInProduct?.length)
              filtered = filtered.filter((u) =>
                u.productAssignments?.some((a) =>
                  a.roles?.some((r) => filters.roleInProduct.includes(r)),
                ),
              );
            if (
              filters.lastLoginRange?.length === 2 &&
              filters.lastLoginRange[0] &&
              filters.lastLoginRange[1]
            ) {
              const [from, to] = filters.lastLoginRange;
              filtered = filtered.filter((u) => {
                if (!u.lastLogin) return false;
                const d = new Date(u.lastLogin);
                return (
                  d >= from.startOf("day").toDate() &&
                  d <= to.endOf("day").toDate()
                );
              });
            }

            filtered.sort((a, b) => {
              const aVal = (a[sortField] || "").toString().toLowerCase();
              const bVal = (b[sortField] || "").toString().toLowerCase();
              return sortOrder === "asc"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
            });

            setTotal(filtered.length);
            const start = (page - 1) * pageSize;
            setUsers(filtered.slice(start, start + pageSize));
          },

          // ── Backend ──
          async () => {
            // Build query params
            const params = new URLSearchParams();
            params.set("Page", page);
            params.set("PageSize", pageSize);
            if (search) params.set("Search", search);
            if (sortField) params.set("SortBy", sortField);
            if (sortOrder) params.set("SortDirection", sortOrder);

            // StatusFilter: API uses 1=Active, 2=Inactive, 3=SoftDeleted
            // We never request soft-deleted users
            if (filters.status?.length) {
              filters.status.forEach((s) => {
                const val = STATUS_FILTER[s];
                if (val) params.append("StatusFilter", val);
              });
            }

            // RoleFilter: API uses 1=Administrator, 2=TenantUser (1-based)
            if (filters.role?.length) {
              filters.role.forEach((r) => {
                const val = ROLE_FILTER[r];
                if (val) params.append("RoleFilter", val);
              });
            }
            const data = await apiFetch(`/v1/users/fetch?${params.toString()}`);

            // Filter out soft-deleted users (status 3) from display
            const normalized = (data.items ?? [])
              .filter((u) => u.status !== 3)
              .map(normalizeUser);

            setTotal(data.totalCount ?? normalized.length);
            setUsers(normalized);
          },
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ── Get single user ──────────────────────────────────
  const getUser = useCallback(async (id) => {
    return dataSource(
      async () => MOCK_USERS.find((u) => u.id === id) ?? null,
      async () => {
        const data = await apiFetch(`/v1/users/${id}`);
        return normalizeUser(data);
      },
    );
  }, []);

  // ── Create user ──────────────────────────────────────
  const addUser = useCallback(
    async (userData) => {
      const body = {
        name: userData.name,
        userName: userData.username,
        email: userData.email,
        randomPassword: userData.password,
      phone: userData.phone ?? "",
      role: ROLE_TO_INT[userData.role] ?? 3,
      tenantId: userData.tenantId,
      productIds: userData.productIds ?? [],
    };
    console.log("Request body:");
    console.log(JSON.stringify(body, null, 2));
    const data = await apiFetch("/v1/users/create", {
      method: "POST",
      body: JSON.stringify(body),
    });

    addNotification({
      type: "success",
      title: "User added",
      message: `Added user ${userData.name}`,
    });
    return data;
  }, [addNotification]);

  // ── Update user ──────────────────────────────────────
  const updateUser = useCallback(
    async (id, userData) => {
      setLoading(true);
      try {
        return await dataSource(
          async () => {
            await new Promise((r) => setTimeout(r, 300));
            const idx = MOCK_USERS.findIndex((u) => u.id === id);
            if (idx !== -1) {
              MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...userData };
              addNotification({
                type: "info",
                title: "User updated",
                message: `Updated user ${MOCK_USERS[idx].name}`,
              });
            }
            return MOCK_USERS[idx];
          },
          async () => {
            const body = {
              name: userData.name,
              userId: userData.userId,
              phone: userData.phone ?? "",
              role: ROLE_TO_INT[userData.role] ?? 3,
              productIds: userData.productIds ?? [],
            };
            const data = await apiFetch(`/v1/users/${id}`, {
              method: "PUT",
              body: JSON.stringify(body),
            });
            addNotification({
              type: "info",
              title: "User updated",
              message: `Updated user ${userData.name}`,
            });
            return data;
          },
        );
      } finally {
        setLoading(false);
      }
    },
    [addNotification],
  );

  // ── Delete single ────────────────────────────────────
  const deleteUser = useCallback(async (id) => {
    return dataSource(
      async () => {
        await new Promise((r) => setTimeout(r, 300));
        const idx = MOCK_USERS.findIndex((u) => u.id === id);
        if (idx !== -1) MOCK_USERS.splice(idx, 1);
      },
      async () => apiFetch(`/v1/users/${id}`, { method: "DELETE" }),
    );
  }, []);

  // ── Delete (single or batch) ─────────────────────────
  const deleteUsers = useCallback(
    async (ids) => {
      setLoading(true);
      try {
        await dataSource(
          async () => {
            await new Promise((r) => setTimeout(r, 300));
            const names = ids
              .map((id) => MOCK_USERS.find((u) => u.id === id)?.name)
              .filter(Boolean)
              .join(", ");
            ids.forEach((id) => {
              const idx = MOCK_USERS.findIndex((u) => u.id === id);
              if (idx !== -1) MOCK_USERS.splice(idx, 1);
            });
            addNotification({
              type: "error",
              title: "User(s) deleted",
              message: `Deleted: ${names}`,
            });
          },
          async () => {
            if (ids.length === 1) {
              await apiFetch(`/v1/users/${ids[0]}`, { method: "DELETE" });
            } else {
              await apiFetch("/v1/users/batch", {
                method: "DELETE",
                body: JSON.stringify({ userIds: ids }),
              });
            }
            addNotification({
              type: "error",
              title: "User(s) deleted",
              message: `Deleted ${ids.length} user(s)`,
            });
          },
        );
      } finally {
        setLoading(false);
      }
    },
    [addNotification],
  );

  // ── Deactivate (single or batch) ─────────────────────
  const deactivateUsers = useCallback(
    async (ids) => {
      setLoading(true);
      try {
        await dataSource(
          async () => {
            await new Promise((r) => setTimeout(r, 300));
            ids.forEach((id) => {
              const idx = MOCK_USERS.findIndex((u) => u.id === id);
              if (idx !== -1) MOCK_USERS[idx].status = "Inactive";
            });
            addNotification({
              type: "warning",
              title: "User(s) deactivated",
              message: `Deactivated ${ids.length} user(s)`,
            });
          },
          async () => {
            if (ids.length === 1) {
              await apiFetch(`/v1/users/${ids[0]}/deactive`, { method: "PUT" });
            } else {
              await apiFetch("/v1/users/batch/deactive", {
                method: "PUT",
                body: JSON.stringify({ userIds: ids }),
              });
            }
            addNotification({
              type: "warning",
              title: "User(s) deactivated",
              message: `Deactivated ${ids.length} user(s)`,
            });
          },
        );
      } finally {
        setLoading(false);
      }
    },
    [addNotification],
  );

  // ── Activate (single or batch) ───────────────────────
  const activateUsers = useCallback(
    async (ids) => {
      setLoading(true);
      try {
        await dataSource(
          async () => {
            await new Promise((r) => setTimeout(r, 300));
            ids.forEach((id) => {
              const idx = MOCK_USERS.findIndex((u) => u.id === id);
              if (idx !== -1) MOCK_USERS[idx].status = "Active";
            });
            addNotification({
              type: "success",
              title: "User(s) activated",
              message: `Activated ${ids.length} user(s)`,
            });
          },
          async () => {
            if (ids.length === 1) {
              await apiFetch(`/v1/users/${ids[0]}/reactive`, { method: "PUT" });
            } else {
              await apiFetch("/v1/users/batch/reactive", {
                method: "PUT",
                body: JSON.stringify({ userIds: ids }),
              });
            }
            addNotification({
              type: "success",
              title: "User(s) activated",
              message: `Activated ${ids.length} user(s)`,
            });
          },
        );
      } finally {
        setLoading(false);
      }
    },
    [addNotification],
  );

  return {
    users,
    loading,
    error,
    total,
    fetchUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    deleteUsers,
    deactivateUsers,
    activateUsers,
  };
}
