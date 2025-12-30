// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const apiBaseUrl = import.meta.env.VITE_API_URL;
import { useShoppingList } from "../../context/ShoppingListContext.jsx";
export function LoginPage() {
  const [email, setEmail] = useState(""); // change to "name" if your backend uses username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useShoppingList();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", { email, password });
    console.log("button clicked");
    setLoading(true);
    setError("");

    try {
      console.log("2. Sending request to:", `${apiBaseUrl}/auth/login`);
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // ← change "email" to "name" if needed
      });

      const data = await response.json();
      console.log("Login response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      console.log("4. Calling context login function...", login(data.token));
      login(data.token);

      console.log("Logged in as:", data.member);

      setTimeout(() => {
        navigate("/");
      }, 10);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center h-screen items-center">
      <div className="flex flex-col">
        <h2
          style={{
            fontSize: "2rem", // increase size (you can adjust: 2rem, 3rem, etc.)
            fontWeight: "bold", // optional: make it bolder
            margin: "0 0 20px 0", // optional: remove default top/bottom margin and add bottom spacing
            textAlign: "center",
          }}
        >
          {t("pages.login.shoppingList")}
        </h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "15px" }}>
            <label>Email:</label>
            <input
              type="email" // change to "text" if using username
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                fontFamily: "Arial, sans-serif",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label> {t("pages.login.password")}:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                fontFamily: "Arial, sans-serif",
                color: "#000",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              rounded: "8px",
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? `${t("pages.login.loginMes1")}`
              : `${t("pages.login.loginMes2")}`}
          </button>
        </form>

        <p style={{ marginTop: "20px" }}>
          {t("pages.login.registerMessage1")}{" "}
          <a href="/register" style={{ color: "#007bff" }}>
            {t("pages.login.registerMessage2")}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
