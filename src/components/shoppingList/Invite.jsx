// src/components/shoppingList/Invite.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { actionTypes } from "../../context/ReducerHelper";

import { useShoppingList } from "../../context/ShoppingListContext.jsx";
import { useParams } from "react-router-dom";
import { addMemberToList } from "../shoppingList/useShoppingList.js";

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
export default function Invite({ dispatch, isOwner }) {
  // LOCAL STATE
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const { actions } = useShoppingList();
  const inviteMemberToList = actions.inviteMemberToList;
  const { shopListId } = useParams();
  const [status, setStatus] = useState({ type: null, text: "" });

  // OWNER CHECK
  if (!isOwner) {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = userName.trim();

    if (!trimmedEmail) {
      setStatus({ type: "error", text: "Zadejte prosím email" });
      return;
    }

    const userData = {
      email: trimmedEmail,
      userName: trimmedName || undefined,
    };

    try {
      const newMemberFromBackend = await addMemberToList(shopListId, userData);
      console.log("[Invite] Member added:", newMemberFromBackend);

      dispatch({
        type: actionTypes.addMember,
        payload: {
          shopListId,
          memberId: newMemberFromBackend.memberId || newMemberFromBackend.id, // Ensure this field matches your API
          userName: newMemberFromBackend.userName || trimmedName,
          email: newMemberFromBackend.email || trimmedEmail,
        },
      });

      // Show success message
      setStatus({
        type: "success",
        text: `${newMemberFromBackend.userName || trimmedEmail} byl přidán!`,
      });

      // Clear form
      setEmail("");
      setUserName("");
    } catch (error) {
      console.error("Failed to add member:", error);

      // Determine error message
      let errorMsg = "Nepodařilo se přidat člena";
      if (error.message?.includes("already a member")) {
        errorMsg = "Uživatel je již v seznamu";
      } else if (error.message?.includes("not registered")) {
        errorMsg = "Uživatel není registrovaný – nelze přidat";
      }

      setStatus({ type: "error", text: errorMsg });
    }
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

            color: "black",
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
          Send invitation
        </button>
      </form>

      {/* DEBUG NOTE */}
    </div>
  );
}

// PropTypes – runtime validation
Invite.propTypes = {
  userId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired,
};
