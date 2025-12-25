// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const apiBaseUrl = import.meta.env.VITE_API_URL;
import { useShoppingList } from "../../context/ShoppingListContext.jsx";
export function LoginPage() {
  const [email, setEmail] = useState(""); // change to "name" if your backend uses username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useShoppingList();

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
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
      <h2 style={{ margin: "15px 0, bold", display: "block" }}>
        Shopping List
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
          <label>Password:</label>
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>
        Don't have an account?{" "}
        <a href="/register" style={{ color: "#007bff" }}>
          Register here
        </a>
        .
      </p>
    </div>
  );
}
