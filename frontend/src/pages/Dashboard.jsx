function Dashboard() {
  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "600",
          marginBottom: "30px",
          color: "#2d3748",
        }}
      >
        Dashboard Overview
      </h1>

      <div
        style={{
          display: "flex",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
            minWidth: "220px",
            flex: 1,
          }}
        >
          <h3 style={{ color: "#6b7280", marginBottom: "10px" }}>
            Total Employees
          </h3>
          <p style={{ fontSize: "32px", fontWeight: "bold" }}>28</p>
        </div>

        {/* Card 2 */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
            minWidth: "220px",
            flex: 1,
          }}
        >
          <h3 style={{ color: "#6b7280", marginBottom: "10px" }}>
            Present Today
          </h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "green" }}>
            22
          </p>
        </div>

        {/* Card 3 */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
            minWidth: "220px",
            flex: 1,
          }}
        >
          <h3 style={{ color: "#6b7280", marginBottom: "10px" }}>
            Absent Today
          </h3>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "red" }}>
            6
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

