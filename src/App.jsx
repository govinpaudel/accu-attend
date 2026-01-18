import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import { AuthProvider } from "./Context/AuthContext";
import Unauthorized from "./Pages/Auth/Unauthorized";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import SuperAdminLayout from "./Pages/SuperAdmin/SuperAdminLayout";

//Super Admin pages
import SuperAdminDashboard from "./Pages/SuperAdmin/SuperAdminDashboard";
import AdminUsers from "./Pages/SuperAdmin/AdminUsers";

//Admin pages
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import Users from "./Pages/Admin/Users";
import Locations from "./Pages/Admin/Locations";
import Rosters from "./Pages/Admin/Rosters";

//user pages
import UserDashboard from "./Pages/User/UserDashboard";
import Profile from "./Pages/User/Profile";
import UserReport from "./Pages/User/UserReport";
import Organizations from "./Pages/SuperAdmin/Organizations";
import ChangePassword from "./Pages/User/ChangePassword";
import ProtectedRoute from "./Pages/Routes/ProtectedRoute";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes (NO sidebar) */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Super Admin Routes */}
          <Route
            path="/superadmin/*"
            element={
              <ProtectedRoute allowedRoles={["super-admin"]}>
                <SuperAdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SuperAdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="organizations" element={<Organizations />} />
          </Route>
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="locations" element={<Locations />} />
            <Route path="Rosters" element={<Rosters />} />
            <Route path="changepassword" element={<ChangePassword />} />
          </Route>
          {/* User Routes */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="changepassword" element={<ChangePassword />} />
            <Route path="report" element={<UserReport />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
