import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "./components/Navbar";
import API from "./services/api";

/* ---------------- HOME / HERO ---------------- */

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const empRes = await API.get("/employees/");
        const employees = empRes.data;

        // Fetch today's attendance summary
        const today = new Date().toISOString().split('T')[0];
        const attRes = await API.get("/attendance/");
        const todayAtt = attRes.data.filter(a => a.date === today);

        const presentCount = todayAtt.filter(a => a.status === 'Present').length;
        const absentCount = todayAtt.filter(a => a.status === 'Absent').length;

        setStats({
          total: employees.length,
          present: presentCount,
          absent: absentCount
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="hero-gradient" style={{ borderRadius: "0 0 2rem 2rem", marginBottom: "3rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: "8px 16px",
            borderRadius: "999px",
            marginBottom: "1.5rem",
            fontSize: "0.875rem",
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Secure & Reliable
          </div>
          <h1 style={{ fontSize: "4rem", fontWeight: "800", marginBottom: "1.5rem", lineHeight: "1.1", color: "white" }}>
            Modern HR Management <br />
            <span style={{ color: "#fef08a" }}>Made Simple</span>
          </h1>
          <p style={{ fontSize: "1.25rem", opacity: "0.9", marginBottom: "2.5rem", maxWidth: "600px", margin: "0 auto 2.5rem" }}>
            Streamline your workforce management with our comprehensive HRMS solution. Track attendance, manage employees, and boost productivity effortlessly.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button className="btn" style={{ backgroundColor: "white", color: "#4f46e5", padding: "0.875rem 2rem", fontSize: "1rem" }} onClick={() => navigate('/add-employee')}>
              Get Started
            </button>
            <button className="btn" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.3)", padding: "0.875rem 2rem", fontSize: "1rem" }} onClick={() => navigate('/attendance')}>
              Mark Attendance
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 2rem 4rem" }}>
        <div style={{ display: "flex", gap: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <div className="card" style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: "var(--primary)", marginBottom: "1rem" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>{stats.total}</h3>
            <p style={{ color: "var(--text-muted)" }}>Total Employees</p>
          </div>
          <div className="card" style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: "var(--success)", marginBottom: "1rem" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>{stats.present}</h3>
            <p style={{ color: "var(--text-muted)" }}>Present Today</p>
          </div>
          <div className="card" style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: "var(--danger)", marginBottom: "1rem" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>{stats.absent}</h3>
            <p style={{ color: "var(--text-muted)" }}>Absent Today</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- ADD EMPLOYEE PAGE ---------------- */

function AddEmployee() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [empId, setEmpId] = useState(null);

  const [formData, setFormData] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
    position: "", // UI only for now
    phone: "",    // UI only for now
    joining_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // Check if we are in edit mode (passed via state or URL)
    const stored = localStorage.getItem("edit_employee");
    if (stored) {
      const emp = JSON.parse(stored);
      setFormData({
        employee_id: emp.employee_id,
        full_name: emp.full_name,
        email: emp.email,
        department: emp.department,
        position: "",
        phone: "",
        joining_date: emp.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
      });
      setIsEdit(true);
      setEmpId(emp.id);
      localStorage.removeItem("edit_employee");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/employees/${empId}`, {
          employee_id: formData.employee_id,
          full_name: formData.full_name,
          email: formData.email,
          department: formData.department
        });
        alert("Employee updated successfully!");
      } else {
        await API.post("/employees/", {
          employee_id: formData.employee_id,
          full_name: formData.full_name,
          email: formData.email,
          department: formData.department
        });
        alert("Employee added successfully!");
      }
      navigate("/manage-employees");
    } catch (err) {
      alert(err.response?.data?.detail || "Error saving employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }} className="animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
        <div style={{ backgroundColor: "var(--primary)", padding: "12px", borderRadius: "12px", color: "white" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="17" y1="11" x2="23" y2="11"></line>
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: "1.875rem", fontWeight: "800", color: "#111827", marginBottom: "0.25rem" }}>
            {isEdit ? "Edit Employee" : "Add New Employee"}
          </h2>
          <p style={{ color: "var(--text-muted)" }}>{isEdit ? "Update employee details" : "Register a new staff member in the system"}</p>
        </div>
      </div>

      <div className="card" style={{ padding: "2.5rem" }}>
        {/* Step Indicator */}
        <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: step === 1 ? "var(--primary)" : "var(--text-muted)", fontWeight: "600" }}>
            <span style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>1</span>
            Personal Info
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: step === 2 ? "var(--primary)" : "var(--text-muted)", fontWeight: "600" }}>
            <span style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>2</span>
            Employment
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>Full Name</label>
                <input type="text" name="full_name" className="form-input" placeholder="e.g. John Doe" required value={formData.full_name} onChange={handleChange} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>Email Address</label>
                <input type="email" name="email" className="form-input" placeholder="john@example.com" required value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>Phone Number</label>
                <input type="tel" name="phone" className="form-input" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} />
              </div>
              <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>Next Step</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>Employee ID</label>
                <input type="text" name="employee_id" className="form-input" placeholder="EMP-001" required value={formData.employee_id} onChange={handleChange} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>Department</label>
                <select name="department" className="form-input" required value={formData.department} onChange={handleChange}>
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="HR">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Design">Design</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>Position</label>
                <input type="text" name="position" className="form-input" placeholder="Software Engineer" value={formData.position} onChange={handleChange} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>Joining Date</label>
                <input type="date" name="joining_date" className="form-input" value={formData.joining_date} onChange={handleChange} />
              </div>
              <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : isEdit ? "Update Employee" : "Create Employee"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees/");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await API.delete(`/employees/${id}`);
        setEmployees(employees.filter(e => e.id !== id));
      } catch (err) {
        alert("Error deleting employee");
      }
    }
  };

  const handleEdit = (emp) => {
    localStorage.setItem("edit_employee", JSON.stringify(emp));
    navigate("/add-employee");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }} className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ backgroundColor: "#8b5cf6", padding: "12px", borderRadius: "12px", color: "white" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: "1.875rem", fontWeight: "800", color: "#111827", marginBottom: "0.25rem" }}>Manage Employees</h2>
            <p style={{ color: "var(--text-muted)" }}>Update or remove employee records</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/add-employee")}>+ Add New</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: "500" }}>{emp.employee_id}</td>
                  <td style={{ fontWeight: "600" }}>{emp.full_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="btn" style={{ padding: "4px 12px", backgroundColor: "var(--primary-light)", color: "var(--primary)" }} onClick={() => handleEdit(emp)}>Edit</button>
                      <button className="btn" style={{ padding: "4px 12px", backgroundColor: "var(--danger-light)", color: "var(--danger)" }} onClick={() => handleDelete(emp.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div style={{ padding: "2rem", textAlign: "center" }}>Loading employees...</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- ATTENDANCE PAGE ---------------- */

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({}); // { empId: status }

  useEffect(() => {
    fetchEmployeesAndAttendance();
  }, [date]);

  const fetchEmployeesAndAttendance = async () => {
    setLoading(true);
    try {
      const [empRes, attRes] = await Promise.all([
        API.get("/employees/"),
        API.get("/attendance/")
      ]);

      setEmployees(empRes.data);

      // Filter attendance for the selected date
      const dailyAttendance = {};
      attRes.data.forEach(record => {
        if (record.date === date) {
          dailyAttendance[record.employee_id] = record.status;
        }
      });
      setAttendanceData(dailyAttendance);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const markStatus = async (empId, status) => {
    try {
      await API.post("/attendance/", {
        employee_id: empId,
        date: date,
        status: status
      });
      setAttendanceData({ ...attendanceData, [empId]: status });
    } catch (err) {
      alert(err.response?.data?.detail || "Error marking attendance");
    }
  };

  const getPresentCount = () => Object.values(attendanceData).filter(s => s === 'Present').length;
  const getAbsentCount = () => Object.values(attendanceData).filter(s => s === 'Absent').length;

  const markAll = async (status) => {
    try {
      await Promise.all(employees.map(emp =>
        API.post("/attendance/", {
          employee_id: emp.id,
          date: date,
          status: status
        })
      ));
      const newAttendance = {};
      employees.forEach(emp => newAttendance[emp.id] = status);
      setAttendanceData({ ...attendanceData, ...newAttendance });
    } catch (err) {
      alert("Error marking bulk attendance");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }} className="animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ backgroundColor: "#db2777", padding: "12px", borderRadius: "12px", color: "white" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="12 6 12 12 16 14"></polyline>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: "1.875rem", fontWeight: "800", color: "#111827", marginBottom: "0.25rem" }}>Mark Attendance</h2>
          <p style={{ color: "var(--text-muted)" }}>Mark employee attendance for today</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)", padding: "10px", borderRadius: "10px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{employees.length}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Total Employees</div>
          </div>
        </div>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ backgroundColor: "var(--success-light)", color: "var(--success)", padding: "10px", borderRadius: "10px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{getPresentCount()}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Present</div>
          </div>
        </div>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ backgroundColor: "var(--danger-light)", color: "var(--danger)", padding: "10px", borderRadius: "10px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{getAbsentCount()}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Absent</div>
          </div>
        </div>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ backgroundColor: "var(--warning-light)", color: "var(--warning)", padding: "10px", borderRadius: "10px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{employees.length - getPresentCount() - getAbsentCount()}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Unmarked</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Date</label>
              <input type="date" className="form-input" style={{ width: "160px" }} value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            <button className="btn btn-success" style={{ backgroundColor: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }} onClick={() => markAll("Present")}>All Present</button>
            <button className="btn btn-danger" style={{ backgroundColor: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }} onClick={() => markAll("Absent")}>All Absent</button>
          </div>
        </div>

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: "500" }}>{emp.employee_id}</td>
                  <td style={{ fontWeight: "600" }}>{emp.full_name}</td>
                  <td style={{ color: "var(--text-muted)" }}>{emp.department}</td>
                  <td>
                    <span className={`badge ${attendanceData[emp.id] === 'Present' ? 'badge-success' : attendanceData[emp.id] === 'Absent' ? 'badge-danger' : 'badge-gray'}`}>
                      {attendanceData[emp.id] || "Unmarked"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="btn" style={{ padding: "4px 12px", backgroundColor: "#f0fdf4", color: "#166534" }} onClick={() => markStatus(emp.id, "Present")}>Present</button>
                      <button className="btn" style={{ padding: "4px 12px", backgroundColor: "#fef2f2", color: "#991b1b" }} onClick={() => markStatus(emp.id, "Absent")}>Absent</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>}
          {!loading && employees.length === 0 && <div style={{ padding: "2rem", textAlign: "center" }}>No employees found.</div>}
        </div>
      </div>
    </div>
  );
}

function Reports() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attRes, empRes] = await Promise.all([
          API.get("/attendance/"),
          API.get("/employees/")
        ]);

        // Sort by date descending (newest first)
        const sortedAttendance = attRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));

        setAttendance(sortedAttendance);
        setEmployees(empRes.data);
      } catch (err) {
        console.error("Error fetching report data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getEmpData = (id) => employees.find(e => e.id === id) || {};

  const filteredAttendance = attendance.filter(record => {
    const emp = getEmpData(record.employee_id);
    return emp.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }} className="animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ backgroundColor: "var(--warning)", padding: "12px", borderRadius: "12px", color: "white" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: "1.875rem", fontWeight: "800", color: "#111827", marginBottom: "0.25rem" }}>Attendance Report</h2>
          <p style={{ color: "var(--text-muted)" }}>View complete historical attendance records</p>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Search Employee</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              className="form-input"
              placeholder="Search by Employee ID or Name..."
              style={{ paddingLeft: "40px", maxWidth: "400px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record, index) => {
                const emp = getEmpData(record.employee_id);
                return (
                  <tr key={index}>
                    <td style={{ fontWeight: "500" }}>{record.date}</td>
                    <td style={{ color: "var(--text-muted)" }}>{emp.employee_id || "N/A"}</td>
                    <td style={{ fontWeight: "600" }}>{emp.full_name || "Unknown"}</td>
                    <td>
                      <span className={`badge ${record.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {loading && <div style={{ padding: "2rem", textAlign: "center" }}>Loading report...</div>}
          {!loading && filteredAttendance.length === 0 && (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <div style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>No records found</h3>
              <p style={{ color: "var(--text-muted)" }}>Try adjusting your search term to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- APP LAYOUT ---------------- */

function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/manage-employees" element={<ManageEmployees />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
