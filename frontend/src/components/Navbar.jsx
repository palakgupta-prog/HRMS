import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="top-nav">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          backgroundColor: "#4f46e5",
          padding: "8px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#111827" }}>HRMS</span>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Home
        </NavLink>
        <NavLink to="/add-employee" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Add Employee
        </NavLink>
        <NavLink to="/attendance" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Mark Attendance
        </NavLink>
        <NavLink to="/manage-employees" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Manage Employees
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Check Attendance
        </NavLink>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ textAlign: "right", display: "none" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: "600" }}>Admin User</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>HR Manager</div>
        </div>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyItems: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "auto" }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </div>
    </nav >
  );
}

export default Navbar;
