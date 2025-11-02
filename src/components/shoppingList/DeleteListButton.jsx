// src/components/shoppingList/DeleteListButton.jsx
import React from "react";
import PropTypes from "prop-types";

export default function DeleteListButton({ userId, ownerId, dispatch }) {
  // UI authorisation: Show button only to the owner
  const isOwner = ownerId === userId;
  if (!isOwner) return null;

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Opravdu chcete smazat nákupní seznam? Tato akce je nevratná."
    );

    if (confirmed) {
      dispatch({ type: "DELETE_LIST" });
    }
  };

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "10px",
        borderTop: "1px solid #eee",
      }}
    >
      <button
        type="button"
        onClick={handleDelete}
        aria-label="Smazat celý nákupní seznam"
        style={{
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          padding: "8px 15px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Smazat celý seznam (Pouze pro Vlastníka)
      </button>
    </div>
  );
}

// PropTypes validation (only in development)
DeleteListButton.propTypes = {
  userId: PropTypes.string.isRequired,
  ownerId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};
