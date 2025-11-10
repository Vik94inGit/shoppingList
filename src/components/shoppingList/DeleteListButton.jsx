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
      dispatch({ type: "DELETE_LIST" });
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        aria-label="Smazat celý nákupní seznam"
      >
        Delete all list
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
