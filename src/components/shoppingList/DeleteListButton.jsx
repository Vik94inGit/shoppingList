// src/components/shoppingList/DeleteListButton.jsx
import React from "react";
import PropTypes from "prop-types";

export function DeleteListButton({ userId, ownerId, dispatch }) {
  // UI authorisation: Show button only to the owner
  const isOwner = ownerId === userId;
  if (!isOwner) return null;

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Opravdu chcete smazat nákupní seznam? Tato akce je nevratná."
    );

    if (confirmed) {
      console.log("[Component] Dispatching DELETE_LIST");
      dispatch({ type: "DELETE_LIST" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      aria-label="Smazat celý nákupní seznam"
    >
      🗑️
    </button>
  );
}

// PropTypes validation (only in development)
DeleteListButton.propTypes = {
  userId: PropTypes.string.isRequired,
  ownerId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};
