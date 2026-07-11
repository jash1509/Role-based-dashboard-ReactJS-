# 🛡️ RoleGuard — Role-Based Dashboard (ReactJS)

A full-featured **role-based access control (RBAC) dashboard** built with **React 19 + Vite**, featuring secure JWT authentication, protected routes, and granular permission management for Admin and User roles.

> **Live GitHub Repo:** [https://github.com/jash1509/Role-based-dashboard-ReactJS-](https://github.com/jash1509/Role-based-dashboard-ReactJS-)

---

## 📸 Features

- 🛡️ **Role-Based Access Control (RBAC)** — Admin and User roles with isolated page access
- 🔐 **JWT Authentication** — Login with token storage, auto-expiry, and session countdown
- 🔒 **Protected Routes** — Unauthenticated users are redirected to `/login`
- 🚫 **Forbidden Page (403)** — Wrong-role access shows a styled error page
- ⚠️ **Error Boundary** — Catches runtime errors and shows a friendly fallback UI
- 📊 **Role-specific Dashboard Views** — Different stats, activities, and quick actions per role
- 👥 **Admin: Manage Users** — Search, toggle status, delete with confirm dialog
- 📦 **Admin: Manage Products** — Browse Indian handcrafted products with stock status
- 👤 **User: My Profile** — View personal info, session token, and API profile data
- 📋 **User: My Orders** — Filter orders by status with summary stats
- 🎨 **Premium Dark UI** — Glassmorphism, gradient orbs, smooth micro-animations

---

## 🧑‍💻 Demo Credentials

| Role  | Email                        | Password   |
|-------|------------------------------|------------|
| Admin | `amit.mehta@roleadmin.dev`   | `admin123` |
| User  | `isha.sharma@reqres.in`      | `cityslicka` |

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── DashboardLayout.jsx   # Sidebar + header layout wrapper
│   ├── ProtectedRoute.jsx    # Redirects unauthenticated users
│   ├── GuestRoute.jsx        # Redirects already-logged-in users
│   ├── RoleRoute.jsx         # Restricts access by role
│   └── ErrorBoundary.jsx     # React error boundary fallback
├── context/
│   └── AuthContext.jsx       # Auth state, login, logout, token expiry
├── pages/
│   ├── LoginPage.jsx         # Login form with demo credential cards
│   ├── DashboardPage.jsx     # Role-specific stats and activity feed
│   ├── ManageUsersPage.jsx   # Admin: search, toggle, delete users
│   ├── ManageProductsPage.jsx# Admin: browse Indian product catalog
│   ├── ProfilePage.jsx       # User: personal info and session token
│   ├── OrdersPage.jsx        # User: filter and view orders
│   ├── ForbiddenPage.jsx     # 403 access denied page
│   └── NotFoundPage.jsx      # 404 page
├── services/
│   ├── api.js                # Axios client, mock data, API calls
│   └── token.js              # JWT storage, expiry, countdown utilities
└── utils/
    └── currency.js           # INR currency formatter
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/jash1509/Role-based-dashboard-ReactJS-.git

# Navigate into the project
cd Role-based-dashboard-ReactJS-

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view in the browser.

### Build for Production

```bash
npm run build
```

---

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://reqres.in/api
VITE_AUTH_LOGIN_ENDPOINT=/login
VITE_AUTH_LOGOUT_ENDPOINT=/logout
VITE_TOKEN_EXPIRY_HOURS=1
VITE_REQRES_API_KEY=reqres-free-v1
```

---

## 🛣️ Routes

| Path               | Access        | Description                    |
|--------------------|---------------|--------------------------------|
| `/`                | Any           | Redirects to `/dashboard`      |
| `/login`           | Guest only    | Login page                     |
| `/dashboard`       | Auth required | Role-specific dashboard        |
| `/manage-users`    | Admin only    | Manage platform users          |
| `/manage-products` | Admin only    | Manage Indian product catalog  |
| `/profile`         | User only     | Personal profile & token info  |
| `/orders`          | User only     | Order history with filters     |
| `/forbidden`       | Any           | 403 Access Denied page         |
| `*`                | Any           | 404 Not Found page             |

---

## 👥 Mock Users

| Name              | Email                          | Role  | Status   |
|-------------------|--------------------------------|-------|----------|
| Gaurav Bhardwaj   | gaurav.bhardwaj@reqres.in      | User  | Active   |
| Jyoti Verma       | jyoti.verma@reqres.in          | User  | Active   |
| Jash Barot        | jash.barot@reqres.in           | Admin | Active   |
| Isha Sharma       | isha.sharma@reqres.in          | User  | Active   |
| Chirag Mehta      | chirag.mehta@reqres.in         | User  | Inactive |
| Tanvi Roy         | tanvi.roy@reqres.in            | User  | Active   |

---

## 📦 Mock Products (Indian Handcraft Catalog)

| Product                      | Pantone    | Year |
|------------------------------|------------|------|
| Jaipur Blue Pottery          | 15-4020    | 2000 |
| Kashmiri Kesar (Saffron)     | 17-2031    | 2001 |
| Banarasi Silk Saree          | 19-1664    | 2002 |
| Darjeeling Tea Blend         | 14-4811    | 2003 |
| Mysore Sandalwood Handcrafted| 17-1456    | 2004 |
| Kerala Coir Artifact         | 15-5217    | 2005 |

---

## 🧰 Tech Stack

| Technology         | Version  | Purpose                        |
|--------------------|----------|-------------------------------|
| React              | 19       | UI framework                  |
| Vite               | 8        | Build tool & dev server       |
| React Router DOM   | 7        | Client-side routing           |
| Axios              | 1.x      | HTTP client                   |
| reqres.in API      | —        | Mock REST API backend         |
| Vanilla CSS        | —        | Premium dark-mode design      |

---

## 🔑 Key Implementation Details

- **RBAC**: Role stored in JWT payload; `RoleRoute` wraps pages with `allowedRoles` prop
- **Token Expiry**: Configured via `VITE_TOKEN_EXPIRY_HOURS`, countdown displayed in header
- **API Fallback**: If `reqres.in` API key fails, falls back to local mock credentials
- **Indian Name Mapping**: `USER_MAPPINGS` in `api.js` transparently remaps reqres.in API responses to Indian user names
- **Avatar Fallbacks**: If user images fail to load, styled initials circles are displayed
- **Error Boundary**: Wraps the entire app to prevent full crashes from rendering errors

---

## 📄 License

MIT © 2025 Jash Barot
