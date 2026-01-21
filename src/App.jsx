import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import { AuthProvider } from "./Context/AuthContext";
import Unauthorized from "./Pages/Auth/Unauthorized";

// Layouts
import SuperAdminLayout from "./Pages/SuperAdmin/SuperAdminLayout";
import OrgAdminLayout from "./layouts/OrgAdminLayout";
import LocAdminLayout from "./layouts/LocAdminLayout";
import UserLayout from "./layouts/UserLayout";


//Super Admin pages
import SuperAdminDashboard from "./Pages/SuperAdmin/SuperAdminDashboard";
import OrgAdminUsers from "./Pages/SuperAdmin/OrgAdminUsers";
import Organizations from "./Pages/SuperAdmin/Organizations";

//Organization Admin pages
import Locations from "./Pages/OrgAdmin/Locations";
import LocAdminUsers from "./Pages/OrgAdmin/LocAdminUsers";


//Location Admin pages
import Rosters from "./Pages/LocAdmin/Rosters";
import LocProfile from "./Pages/LocAdmin/LocProfile";
import Users from "./Pages/LocAdmin/Users"



//user pages
import UserDashboard from "./Pages/User/UserDashboard";
import Profile from "./Pages/User/Profile";
import UserReport from "./Pages/User/UserReport";

//common pages
import ChangePassword from "./Pages/User/ChangePassword";
import ProtectedRoute from "./Pages/Routes/ProtectedRoute";
import LocAdminDashboard from "./Pages/LocAdmin/LocAdminDashboard";


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
            <Route path="users" element={<OrgAdminUsers />} />            
            <Route path="organizations" element={<Organizations />} />
             <Route path="changepassword" element={<ChangePassword />} />
          </Route>
          {/* Admin Routes */}
          <Route
            path="/locadmin/*"
            element={
              <ProtectedRoute allowedRoles={["locadmin"]}>
                <LocAdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<LocAdminDashboard />} />
            <Route path="locprofile" element={<LocProfile />} />            
            <Route path="users" element={<Users />} />            
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
