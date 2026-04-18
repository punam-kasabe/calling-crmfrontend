// Navbar.js
export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{
      marginLeft: "240px",
      height: "60px",
      background: "#fff",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px"
    }}>
      <h5>Dashboard</h5>

      <div>
        👤 {user?.name} ({user?.role})
      </div>
    </div>
  );
}