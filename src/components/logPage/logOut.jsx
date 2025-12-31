import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function LogoutButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path d="M10 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h6v-2H5V4h5V3z" />
        <path d="M20.707 11.293l-3-3a1 1 0 0 0-1.414 1.414L17.586 11H9v2h8.586l-1.293 1.293a1 1 0 0 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414z" />
      </svg>
    </button>
  );
}
