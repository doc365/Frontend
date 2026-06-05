// import { createContext, useContext, useState } from "react";
// import { MOCK_AUTH, MOCK_USERS } from "../mock/data";
// import { dataSource, apiFetch } from "../api/config";
// import { ROLE_MAP } from "../api/userEnums";

// const AuthContext = createContext(null);

// // Shape backend auth response → UI user object
// function shapeUser(data) {
//   return {
//     id: data.id,
//     userId: data.userId,
//     name: data.name,
//     email: data.email,
//     phone: data.phone ?? "",
//     status: data.status,
//     role: ROLE_MAP[data.role] ?? "Tenant User",
//     roleInt: data.role,
//     products: data.products ?? [],
//   };
// }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     try {
//       const stored = localStorage.getItem("mos_user");
//       return stored ? JSON.parse(stored) : null;
//     } catch {
//       return null;
//     }
//   });

//   const persist = (userData) => {
//     setUser(userData);
//     localStorage.setItem("mos_user", JSON.stringify(userData));
//   };

//   // ── Login ────────────────────────────────────────────
//   const login = async (email, password) => {
//     try {
//       return await dataSource(
//         // ── Mock ──
//         async () => {
//           await new Promise((r) => setTimeout(r, 600));

//           if (email === MOCK_AUTH.email && password === MOCK_AUTH.password) {
//             persist(MOCK_AUTH.user);
//             return { success: true };
//           }

//           const found = MOCK_USERS.find(
//             (u) => u.email === email && u._password === password,
//           );
//           if (found) {
//             persist({
//               id: found.id,
//               userId: found.userId,
//               name: found.name,
//               fullName: found.fullName,
//               email: found.email,
//               role: found.role,
//               signInMethod: found.signInMethod,
//               sex: found.sex,
//               phone: found.phone,
//               staffId: found.staffId,
//             });
//             return { success: true };
//           }

//           return { success: false, message: "Invalid email or password" };
//         },

//         // ── Backend ──
//         async () => {
//           const data = await apiFetch("/v1/auths/login", {
//             method: "POST",
//             body: JSON.stringify({ email, password }),
//           });
//           localStorage.setItem("mos_token", data.token);
//           persist(shapeUser(data));
//           return { success: true };
//         },
//       );
//     } catch (err) {
//       return { success: false, message: err.message || "Login failed" };
//     }
//   };

//   // ── Register ─────────────────────────────────────────
//   const register = async (values) => {
//     try {
//       return await dataSource(
//         // ── Mock ──
//         async () => {
//           await new Promise((r) => setTimeout(r, 600));

//           const exists =
//             MOCK_USERS.find((u) => u.email === values.email) ||
//             values.email === MOCK_AUTH.email;
//           if (exists)
//             return { success: false, message: "Email already registered" };

//           MOCK_USERS.push({
//             id: Date.now(),
//             userId: values.userId,
//             name: values.fullName,
//             fullName: values.fullName,
//             email: values.email,
//             _password: values.password,
//             role: "Tenant Administrator",
//             signInMethod: "Local user",
//             status: "Active",
//             createdAt: new Date().toISOString().split("T")[0],
//             lastLogin: null,
//             sex: null,
//             phone: values.phone || null,
//             staffId: `STAFF-${Date.now()}`,
//             productAssignments: [],
//           });
//           return { success: true };
//         },

//         // ── Backend ──
//         async () => {
//           await apiFetch("/v1/auths/register", {
//             method: "POST",
//             body: JSON.stringify({
//               userName: values.userId,
//               name: values.fullName,
//               email: values.email,
//               password: values.password,
//               phone: values.phone,
//               tenantId: values.tenantId,
//             }),
//           });
//           return { success: true };
//         },
//       );
//     } catch (err) {
//       return { success: false, message: err.message || "Registration failed" };
//     }
//   };

//   // ── Logout ───────────────────────────────────────────
//   const logout = async () => {
//     await dataSource(
//       // ── Mock ──
//       async () => {},

//       // ── Backend ──
//       async () => {
//         if (!user) return;
//         try {
//           await apiFetch("/v1/auths/logout", {
//             method: "POST",
//             body: JSON.stringify({
//               userId: user.id,
//               name: user.name,
//               userName: user.userId,
//               email: user.email,
//               objectAffected: "MOS Platform",
//               category: 1, // CategoryLogType.Account
//               action: 2, // AuditAction.SignOut
//               timestamp: new Date().toISOString(),
//             }),
//           });
//         } catch {
//           // best-effort — clear session regardless
//         }
//       },
//     );

//     setUser(null);
//     localStorage.removeItem("mos_user");
//     localStorage.removeItem("mos_token");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, register }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
