import { useNavigate } from "react-router-dom";

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication data
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    // Optional: clear everything in sessionStorage
    // sessionStorage.clear();

    // Redirect to login page
    navigate("/login", { replace: true });
  };
  return (
    <button onClick={handleLogout} className="logout-btn">
      Log out
    </button>
  );
}
