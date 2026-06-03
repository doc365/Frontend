import { useState, useCallback } from "react";
import { MOCK_USERS } from "../mock/data";
import { useNotifications } from "../context/NotificationContext";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const { addNotification } = useNotifications();

  const fetchUsers = useCallback(async ({
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
      await new Promise((r) => setTimeout(r, 300));
      let filtered = [...MOCK_USERS];

      // Text search
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.userId.toLowerCase().includes(q)
        );
      }

      // Sign-in method (multi)
      if (filters.signInMethod?.length) {
        filtered = filtered.filter((u) => filters.signInMethod.includes(u.signInMethod));
      }

      // Role (multi)
      if (filters.role?.length) {
        filtered = filtered.filter((u) => filters.role.includes(u.role));
      }

      // Status (multi)
      if (filters.status?.length) {
        filtered = filtered.filter((u) => filters.status.includes(u.status));
      }

      // Product (multi - user must be assigned to at least one selected product)
      if (filters.product?.length) {
        filtered = filtered.filter((u) =>
          u.productAssignments?.some((a) => filters.product.includes(a.productId))
        );
      }

      // Role in product (multi - user must have at least one selected role across any product)
      if (filters.roleInProduct?.length) {
        filtered = filtered.filter((u) =>
          u.productAssignments?.some((a) =>
            a.roles?.some((r) => filters.roleInProduct.includes(r))
          )
        );
      }

      // Last login date range
      if (filters.lastLoginRange?.length === 2 && filters.lastLoginRange[0] && filters.lastLoginRange[1]) {
        const [from, to] = filters.lastLoginRange;
        filtered = filtered.filter((u) => {
          if (!u.lastLogin) return false;
          const loginDate = new Date(u.lastLogin);
          return loginDate >= from.startOf("day").toDate() && loginDate <= to.endOf("day").toDate();
        });
      }

      // Sort
      filtered.sort((a, b) => {
        const aVal = (a[sortField] || "").toString().toLowerCase();
        const bVal = (b[sortField] || "").toString().toLowerCase();
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });

      setTotal(filtered.length);
      const start = (page - 1) * pageSize;
      setUsers(filtered.slice(start, start + pageSize));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(async (userData) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      const newUser = {
        ...userData,
        id: Date.now(),
        createdAt: new Date().toISOString().split("T")[0],
        status: "Active",
        productAssignments: [],
        _password: userData.password,
      };
      MOCK_USERS.push(newUser);
      addNotification({ type: "success", title: "User added", message: `You added new user ${userData.name}` });
      return newUser;
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  const updateUser = useCallback(async (id, userData) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      const idx = MOCK_USERS.findIndex((u) => u.id === id);
      if (idx !== -1) {
        MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...userData };
        addNotification({ type: "info", title: "User updated", message: `You updated user ${MOCK_USERS[idx].name}` });
      }
      return MOCK_USERS[idx];
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  const deleteUsers = useCallback(async (ids) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      const names = ids.map((id) => MOCK_USERS.find((u) => u.id === id)?.name).filter(Boolean).join(", ");
      ids.forEach((id) => {
        const idx = MOCK_USERS.findIndex((u) => u.id === id);
        if (idx !== -1) MOCK_USERS.splice(idx, 1);
      });
      addNotification({ type: "error", title: "User(s) deleted", message: `You deleted: ${names}` });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  const deactivateUsers = useCallback(async (ids) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      ids.forEach((id) => {
        const idx = MOCK_USERS.findIndex((u) => u.id === id);
        if (idx !== -1) MOCK_USERS[idx].status = "Inactive";
      });
      addNotification({ type: "warning", title: "User(s) deactivated", message: `You deactivated ${ids.length} user(s)` });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  const activateUsers = useCallback(async (ids) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      ids.forEach((id) => {
        const idx = MOCK_USERS.findIndex((u) => u.id === id);
        if (idx !== -1) MOCK_USERS[idx].status = "Active";
      });
      addNotification({ type: "success", title: "User(s) activated", message: `You activated ${ids.length} user(s)` });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  return { users, loading, error, total, fetchUsers, addUser, updateUser, deleteUsers, deactivateUsers, activateUsers };
}