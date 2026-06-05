import { createContext, useContext, useState, useEffect, use } from "react";

import { MOCK_AUTH, MOCK_USERS } from "../mock/data";
import { dataSource, apiFetch } from "../api/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("mos_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // ==========================================
  // Handle Microsoft OAuth callback
  // ==========================================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authResponse = params.get("authResponse");

    if (!authResponse) return;

    try {
      const result = JSON.parse(decodeURIComponent(authResponse));

      const userData = {
        id: result.id,
        userId: result.userId,
        name: result.name,
        email: result.email,
        phone: result.phone,
        role: result.role,
        status: result.status,
        signInMethod: result.signInMethod,
      };

      localStorage.setItem("mos_token", result.token);

      localStorage.setItem("mos_user", JSON.stringify(userData));

      if (result.products) {
        localStorage.setItem("mos_products", JSON.stringify(result.products));
      }

      setUser(userData);

      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      console.error("Failed to parse authResponse", err);
    }
  }, []);

  // ==========================================
  // Local / Backend Login
  // ==========================================
  const login = async (email, password) => {
    return dataSource(
      async () => {
        // Local mock (optional)
        await new Promise((r) => setTimeout(r, 500));
        return { success: true, mfaCode: "123456" }; 
      },
      async () => {
        const data = await apiFetch("/auths/login", {
          method: "POST",
          body: JSON.stringify({ email }),
        }, { skipAuth: true });

        console.log(data);
   
       return { success: true };

      },
    );
  };

  // ==========================================
  // Local / BackEnd Verify
  // ==========================================
  const verify = async (email, password, code) => {
    return dataSource(
      async () => {
        await new Promise((r) => setTimeout(r, 600));

        if (email === MOCK_AUTH.email && password === MOCK_AUTH.password) {
          const userData = MOCK_AUTH.user;

          setUser(userData);

          localStorage.setItem("mos_user", JSON.stringify(userData));

          return { success: true };
        }

        const found = MOCK_USERS.find(
          (u) => u.email === email && u._password === password,
        );

        if (found) {
          const userData = {
            id: found.id,
            userId: found.userId,
            name: found.name,
            fullName: found.fullName,
            email: found.email,
            role: found.role,
            signInMethod: found.signInMethod,
            sex: found.sex,
            phone: found.phone,
            staffId: found.staffId,
          };

          setUser(userData);

          localStorage.setItem("mos_user", JSON.stringify(userData));

          return { success: true };
        }

        return {
          success: false,
          message: "Invalid email or password",
        };
      },

      async () => {
        // Backend verify call
        const data = await apiFetch("/auths/verify-mfa", {
          method: "POST",
          body: JSON.stringify({ email, password, MfaCode: code }),
        }, { skipAuth: true });
        
        console.log(data);
        const userData = {
          id: data.id,
          userId: data.name,
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: data.status,
          role: data.role,
          signInMethod: data.signInMethod,
        };
  
        localStorage.setItem("mos_token", data.token);
        localStorage.setItem("mos_user", JSON.stringify(userData));
  
        if (data.products) {
          localStorage.setItem("mos_products", JSON.stringify(data.products));
        }
  
        setUser(userData);
        return { success: true };
      },
    );
  };


  // ==========================================
  // Microsoft Login
  // ==========================================
  const loginWithMicrosoft = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/v1/auths/microsoft`;
  };

  // ==========================================
  // Register
  // ==========================================
  const register = async (values) => {
    return dataSource(
      async () => {
        await new Promise((r) => setTimeout(r, 600));

        const exists =
          MOCK_USERS.find((u) => u.email === values.email) ||
          values.email === MOCK_AUTH.email;

        if (exists) {
          return {
            success: false,
            message: "Email already registered",
          };
        }

        MOCK_USERS.push({
          id: Date.now(),
          userId: values.userId,
          name: values.fullName,
          fullName: values.fullName,
          email: values.email,
          _password: values.password,
          role: "Tenant User",
          signInMethod: "Local user",
          status: "Active",
          createdAt: new Date().toISOString().split("T")[0],
          lastLogin: null,
          sex: null,
          phone: values.phone || null,
          staffId: null,
          productAssignments: [],
        });

        return { success: true };
      },

      async () => {
        await apiFetch("/v1/auths/register", {
          method: "POST",
          body: JSON.stringify(values),
        });

        return { success: true };
      },
    );
  };

  // ==========================================
  // Helpers
  // ==========================================
  const getProducts = () => {
    try {
      return JSON.parse(localStorage.getItem("mos_products") || "[]");
    } catch {
      return [];
    }
  };

  const isMicrosoftUser = () => {
    return (
      user?.signInMethod === "Microsoft" ||
      user?.signInMethod === "microsoft" ||
      user?.signInMethod === 1
    );
  };

  // ==========================================
  // Logout
  // ==========================================
  const logout = () => {
    setUser(null);

    localStorage.removeItem("mos_user");

    localStorage.removeItem("mos_token");

    localStorage.removeItem("mos_products");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        verify,
        loginWithMicrosoft,
        register,
        logout,
        getProducts,
        isMicrosoftUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
