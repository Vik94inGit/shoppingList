// src/components/shoppingList/Invite.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * INVITE COMPONENT – OWNER-ONLY INVITATION FORM
 *
 * DATAFLOW (krok za krokem):
 * 1. Props → `userId`, `dispatch`, `isOwner`
 * 2. Mount → `email=""`, `userName=""`
 * 3. Input changes → `setEmail`, `setUserName` + LOG
 * 4. Submit → validate → dispatch(ADD_MEMBER) → reset + LOG
 * 5. Non-owner → returns null (no render)
 *
 * LOGS: prefixed with `[Invite]` → filter in Console!
 */
export default function Invite({ userId, dispatch, isOwner }) {
  // LOCAL STATE
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");

  // OWNER CHECK
  if (!isOwner) {
    console.log(
      `[Invite] Non-owner (userId="${userId}") → component NOT rendered`
    );
    return null;
  }

  // HANDLE INPUT CHANGES
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
  };

  // HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    // TRIM & VALIDATE
    const trimmedEmail = email.trim();
    const trimmedName = userName.trim();

    if (!trimmedEmail || !trimmedName) {
      console.log(`[Invite] Validation FAILED: missing email or name`);
      return;
    }

    // PAYLOAD
    const payload = {
      email: trimmedEmail,
      userName: trimmedName,
    };

    // DISPATCH → Reducer handles invitation
    dispatch({
      type: "ADD_MEMBER",
      payload,
    });

    // RESET FORM
    setEmail("");
    setUserName("");
  };

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        border: "2px solid #007bff",
        borderRadius: "8px",
        backgroundColor: "#e3f2fd",
        boxShadow: "0 2px 4px rgba(0,123,255,0.1)",
      }}
    >
      {/* HEADER */}
      <h4 style={{ margin: "0 0 12px 0", color: "#1565c0", fontWeight: "600" }}>
        Pozvat nového člena (Pouze pro Vlastníka)
      </h4>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
        aria-label="Formulář pro pozvání nového člena"
      >
        {/* USERNAME INPUT */}
        <input
          type="text"
          placeholder="Jméno uživatele (např. Petr)"
          value={userName}
          onChange={handleNameChange}
          required
          style={{
            minWidth: "150px",
            padding: "8px 12px",
            border: "1px solid #90caf9",
            borderRadius: "4px",
            fontSize: "14px",
          }}
          aria-label="Jméno uživatele"
        />

        {/* EMAIL INPUT */}
        <input
          type="email"
          placeholder="Email pro pozvánku (např. petr@example.com)"
          value={email}
          onChange={handleEmailChange}
          required
          style={{
            flexGrow: 1,
            minWidth: "200px",
            padding: "8px 12px",
            border: "1px solid #90caf9",
            borderRadius: "4px",
            fontSize: "14px",
          }}
          aria-label="Emailová adresa"
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={!email.trim() || !userName.trim()}
          style={{
            backgroundColor:
              email.trim() && userName.trim() ? "#007bff" : "#bbdefb",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: email.trim() && userName.trim() ? "pointer" : "not-allowed",
            fontWeight: "bold",
            fontSize: "14px",
            transition: "all 0.2s",
          }}
          aria-label="Poslat pozvánku"
        >
          Poslat pozvánku
        </button>
      </form>

      {/* DEBUG NOTE */}
      {process.env.NODE_ENV === "development" && (
        <small
          style={{
            display: "block",
            marginTop: "10px",
            color: "#0d47a1",
            fontSize: "12px",
            fontStyle: "italic",
          }}
        >
          Otevři DevTools Console → filtruj `[Invite]` pro dataflow!
        </small>
      )}
    </div>
  );
}

// PropTypes – runtime validation
Invite.propTypes = {
  userId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired,
};
