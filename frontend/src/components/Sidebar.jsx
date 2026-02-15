import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>HRMS Panel</h2>

      <Link to="/">Dashboard</Link>
      <Link to="/employees">Employees</Link>
      <Link to="/attendance">Attendance</Link>
      <Link to="/reports">Reports</Link>
      <Link to="/settings">Settings</Link>
    </div>
  );
}

export default Sidebar;

