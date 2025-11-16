// src/components/shoppingList/EditName.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

export function EditName({ name, dispatch, shopListId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleEditClick = () => {
    setIsEditing(true);
    setNewName(name);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewName(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = newName.trim();

    if (!trimmed) {
      console.log(`[EditName] Validation FAILED: empty name`);
      return;
    }

    dispatch({
      type: "RENAME_LIST",
      payload: { listId: shopListId, newName: trimmed },
    });

    setIsEditing(false);
  };

  // HANDLE CANCEL
  const handleCancel = () => {
    setIsEditing(false);
    setNewName(name);
  };

  // OWNER VIEW
  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={handleInputChange}
            placeholder="Nový název"
            required
            autoFocus
          />
          <button type="submit">💾</button>
          <button type="button" onClick={handleCancel}>
            ❌
          </button>
        </form>
      ) : (
        <div className="flex gap-4">
          {/* TODO: replace with pen icon */}
          <button onClick={handleEditClick}>✏️</button>
        </div>
      )}
    </div>
  );
}

EditName.propTypes = {
  name: PropTypes.string.isRequired,
  ownerId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};
