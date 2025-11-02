// src/components/shoppingList/EditName.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useShoppingList } from "../../context/shoppingListContext";

export default function EditName({ name, ownerId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const { dispatch, userId } = useShoppingList();

  const isOwner = ownerId === userId;

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

    // if (!isOwner) {
    //   console.log(`[EditName] BLOCKED: not owner`);
    //   return;
    // }

    dispatch({
      type: "RENAME_LIST",
      payload: { newName: trimmed },
    });

    setIsEditing(false);
  };

  // HANDLE CANCEL
  const handleCancel = () => {
    setIsEditing(false);
    setNewName(name);
  };

  if (!isOwner) {
    return <h3 style={{ margin: "0 0 10px 0", color: "#495057" }}>{name}</h3>;
  }

  // OWNER VIEW
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "12px",
        flexWrap: "wrap",
      }}
    >
      <h2>🛒 Nákupní Seznam: </h2>

      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            minWidth: "200px",
          }}
        >
          <input
            type="text"
            value={newName}
            onChange={handleInputChange}
            placeholder="Nový název"
            required
            autoFocus
            style={{
              padding: "8px 12px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
          <button type="submit" style={btnStyle("green")}>
            Uložit
          </button>
          <button type="button" onClick={handleCancel} style={btnStyle("gray")}>
            Zrušit
          </button>
        </form>
      ) : (
        <>
          <h2>{name}</h2>
          <button onClick={handleEditClick} style={btnStyle("blue")}>
            Rename
          </button>
        </>
      )}
    </div>
  );
}

// Button styles
const btnStyle = (color) => ({
  backgroundColor: { green: "#28a745", gray: "#6c757d", blue: "#007bff" }[
    color
  ],
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
});

EditName.propTypes = {
  name: PropTypes.string.isRequired,
  ownerId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};
