// src/components/shoppingList/ItemRow.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useShoppingList } from "../../context/shoppingListContext";

/**
 * ITEMROW – Renders a single shopping item with edit/remove controls
 *
 * Props:
 *   item       → { itemId, itemName, count, isResolved }
 *   isManager  → true if user can edit/remove (owner or member)
 *   dispatch   → context dispatch to send actions to reducer
 */
export default function ItemRow({ item, isManager }) {
  // -------------------------------------------------
  // 1. LOCAL STATE – for inline editing
  // -------------------------------------------------
  const [isEditing, setIsEditing] = useState(false); // Are we in edit mode?
  const [editName, setEditName] = useState(item.itemName); // Temp name
  const [editCount, setEditCount] = useState(item.count); // Temp count

  const { listData, dispatch, userId } = useShoppingList();

  // -------------------------------------------------
  // 2. DEFENSIVE CHECK – prevent crash on bad data
  // -------------------------------------------------
  if (!item || !item.itemId) {
    console.warn("[ItemRow] Invalid or missing item:", item);
    return null; // Skip rendering
  }

  // Destructure item for easier access
  const { itemId, itemName, count, isResolved } = item;

  // -------------------------------------------------
  // 3. ACTION HANDLERS – send to reducer via dispatch
  // -------------------------------------------------
  const handleToggle = () => {
    dispatch({
      type: "TOGGLE_ITEM_RESOLVED",
      payload: { itemId },
    });
  };

  const handleSave = () => {
    const trimmedName = editName.trim();
    if (!trimmedName) {
      console.warn("[ItemRow] Empty name → abort save");
      return;
    }

    dispatch({
      type: "UPDATE_ITEM",
      payload: { itemId, itemName: trimmedName, count: editCount },
    });
    setIsEditing(false); // Exit edit mode
  };

  const handleCancel = () => {
    setEditName(itemName);
    setEditCount(count);
    setIsEditing(false);
  };

  const handleRemove = () => {
    if (!window.confirm(`Opravdu smazat "${itemName}"?`)) {
      console.log("[ItemRow] REMOVE CANCELLED by user");
      return;
    }

    dispatch({ type: "REMOVE_ITEM", payload: { itemId } });
  };

  // -------------------------------------------------
  // 4. RENDER UI
  // -------------------------------------------------
  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px dotted #dee2e6",
        opacity: isResolved ? 0.6 : 1,
        backgroundColor: isResolved ? "#f8f9fa" : "transparent",
      }}
    >
      {/* 4.1 – RESOLVED CHECKBOX */}
      <input
        type="checkbox"
        checked={isResolved}
        onChange={handleToggle}
        disabled={!isManager}
        style={{
          marginRight: "12px",
          cursor: isManager ? "pointer" : "not-allowed",
        }}
        title={
          isManager ? "Označit jako vyřešené" : "Pouze správci mohou měnit"
        }
      />

      {/* 4.2 – NAME & COUNT (EDIT MODE OR VIEW MODE) */}
      {isEditing ? (
        <div style={{ display: "flex", gap: "8px", flex: 1 }}>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            style={{
              flex: 1,
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ced4da",
            }}
            autoFocus
            placeholder="Název položky"
          />
          <input
            type="number"
            value={editCount}
            onChange={(e) => setEditCount(Math.max(1, Number(e.target.value)))}
            min="1"
            style={{
              width: "70px",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ced4da",
            }}
          />
        </div>
      ) : (
        <span style={{ flex: 1, fontWeight: isResolved ? "normal" : "500" }}>
          <strong>{itemName}</strong> × {count}
          {isResolved && (
            <em style={{ color: "#6c757d", marginLeft: "8px" }}> (vyřešeno)</em>
          )}
        </span>
      )}

      {/* 4.3 – ACTION BUTTONS (only for managers) */}
      {isManager && (
        <div style={{ display: "flex", gap: "6px" }}>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                style={btnStyle("green")}
                title="Uložit změny"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                style={btnStyle("gray")}
                title="Zrušit úpravy"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(true);
                }}
                style={btnStyle("blue")}
                title="Upravit položku"
              >
                Edit
              </button>
              <button
                onClick={handleRemove}
                style={btnStyle("red")}
                title="Smazat položku"
              >
                Remove
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
}

// -------------------------------------------------
// 5. HELPER: Button styles
// -------------------------------------------------
const btnStyle = (color) => ({
  backgroundColor: {
    green: "#28a745",
    gray: "#6c757d",
    blue: "#007bff",
    red: "#dc3545",
  }[color],
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
  transition: "opacity 0.2s",
  ":hover": { opacity: 0.9 },
});

// -------------------------------------------------
// 6. PROPTYPES – runtime validation
// -------------------------------------------------
ItemRow.propTypes = {
  item: PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    isResolved: PropTypes.bool.isRequired,
  }).isRequired,
  isManager: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};
