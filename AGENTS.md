# Workplace Client

Admin dashboard for user management, subscriptions, reporting, and settings. Built with React 19 + Vite.

## Quick Start

```bash
npm install
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build
npm run lint     # ESLint check
```

## Architecture

### Tech Stack
- **Framework**: React 19 + React Router 7 (client-side routing)
- **Build**: Vite 8 (fast HMR, optimized builds)
- **UI**: Ant Design 6 + SCSS modules
- **HTTP**: Axios (API client)
- **Data**: xlsx (Excel file handling)
- **State**: Context API (auth, notifications)

### Key Concepts

**Authentication Flow**
- `AuthContext` manages login/logout state
- `ProtectedRoute` wraps authenticated pages
- Login and Register pages handle credentials

**Page Structure**
- Pages live in `/src/pages/` organized by feature
- Each page may have sub-pages (e.g., `UserManagement` → `ManageAdminRoles`)
- `AppLayout` wraps all authenticated routes (sidebar, header, etc.)

**Styling**
- Global styles in `/src/styles/global.scss`
- SCSS variables in `/src/styles/variables.scss`
- Component styles use `.module.scss` files colocated with JSX

### Directory Map

```
src/
├── pages/              # Route-level components
│   ├── Login, Register
│   ├── Home
│   ├── UserManagement/ # with ManageAdminRoles sub-page
│   ├── Subscriptions, Settings, Reports, Customize, Announcements
├── components/
│   ├── common/         # ProtectedRoute, ProfileDrawer
│   ├── layout/         # AppLayout
├── context/            # AuthContext, NotificationContext
├── api/                # axios client setup
├── hooks/              # useProducts, useUsers
├── styles/             # global.scss, variables.scss
├── mock/               # Mock data for development
├── assets/             # Images and SVGs
├── App.jsx             # Route definitions
└── main.jsx            # React.createRoot entry
```

## Development Notes

- **No TypeScript** — Uses JSX with standard JS
- **Mock data** available in `/src/mock/data.js` for testing without backend
- **API client** in `/src/api/client.js` — configure base URL there
- **Notifications** via `NotificationContext` (use from context)
- **Ant Design theming** — customize via antd config or CSS variables

## Known Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/login` | Login | Authentication |
| `/register` | Register | User registration |
| `/` | Home | Main dashboard |
| `/users` | UserManagement | View/manage users |
| `/users/admin-roles` | ManageAdminRoles | Assign admin roles |
| `/subscriptions` | Subscriptions | Manage subscriptions |
| `/settings` | Settings | App settings |
| `/reports` | Reports | Analytics/reports |
| `/customize` | Customize | Customization options |
| `/announcements` | Announcements | System announcements |
