import { createContext, useContext, useState } from "react";
import { MOCK_AUTH, MOCK_USERS } from "../mock/data";
import { dataSource, apiFetch } from "../api/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("mos_user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = async (email, password) => {
    return dataSource(
      // ── Mock login ──────────────────────────────────
      async () => {
        await new Promise((r) => setTimeout(r, 600));

        // Check MOCK_AUTH first (admin hardcoded)
        if (email === MOCK_AUTH.email && password === MOCK_AUTH.password) {
          const userData = MOCK_AUTH.user;
          setUser(userData);
          localStorage.setItem("mos_user", JSON.stringify(userData));
          return { success: true };
        }

        // Check registered MOCK_USERS (users created via Add User)
        const found = MOCK_USERS.find((u) => u.email === email && u._password === password);
        if (found) {
          const userData = {
            id: found.id, userId: found.userId, name: found.name,
            fullName: found.fullName, email: found.email,
            role: found.role, signInMethod: found.signInMethod,
            sex: found.sex, phone: found.phone, staffId: found.staffId,
          };
          setUser(userData);
          localStorage.setItem("mos_user", JSON.stringify(userData));
          return { success: true };
        }

        return { success: false, message: "Invalid email or password" };
      },
      // ── Backend login ────────────────────────────────
      async () => {
        const data = await apiFetch("/v1/auths/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        localStorage.setItem("mos_token", data.token);
        setUser({
          id: data.id,
          userId: data.userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: data.status,
          role: data.role,
        });
        localStorage.setItem("mos_user", JSON.stringify({
          id: data.id,
          userId: data.userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: data.status,
          role: data.role,
        }));
        return { success: true };
      }
    );
  };

  const register = async (values) => {
    return dataSource(
      async () => {
        await new Promise((r) => setTimeout(r, 600));
        // Check email not already taken
        const exists = MOCK_USERS.find((u) => u.email === values.email) || values.email === MOCK_AUTH.email;
        if (exists) return { success: false, message: "Email already registered" };

        const newUser = {
          id: Date.now(),
          userId: values.userId,
          name: values.fullName,
          fullName: values.fullName,
          email: values.email,
          _password: values.password, // stored for mock login check
          role: "Tenant User",
          signInMethod: "Local user",
          status: "Active",
          createdAt: new Date().toISOString().split("T")[0],
          lastLogin: null,
          sex: null, phone: values.phone || null, staffId: null,
          productAssignments: [],
        };
        MOCK_USERS.push(newUser);
        return { success: true };
      },
      async () => {
        await apiFetch("/v1/auths/register", { method: "POST", body: JSON.stringify(values) });
        return { success: true };
      }
    );
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mos_user");
    localStorage.removeItem("mos_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
