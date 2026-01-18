import { NavLink, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">My App</h2>
        <nav>
          <NavLink to="/dashboard" end>
            Dashboard
          </NavLink>
          <NavLink to="/users">
            Users
          </NavLink>
          <NavLink to="/reports">
            Reports
          </NavLink>
          <NavLink to="/devices">
            Devices
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
