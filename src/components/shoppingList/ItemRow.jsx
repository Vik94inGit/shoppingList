import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useShoppingList } from "../../context/ShoppingListContext";

export default function ItemRow({ item, isManager }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.itemName);
  const [editCount, setEditCount] = useState(item.count);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  // ← Wrap in useCallback to stabilize reference
  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  }, []); // ← No dependencies! setIsMenuOpen is stable

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]); // ← Only re-subscribe if handler changes
  const { dispatch } = useShoppingList();

  if (!item || !item.itemId) return null;
  const { itemId, itemName, count, isResolved } = item;

  const handleToggle = () => {
    dispatch({ type: "TOGGLE_ITEM_RESOLVED", payload: { itemId } });
  };

  const handleSave = () => {
    const trimmedName = editName.trim();
    if (!trimmedName) return;
    dispatch({
      type: "UPDATE_ITEM",
      payload: { itemId, itemName: trimmedName, count: editCount },
    });
    setIsEditing(false);
    setIsMenuOpen(false);
  };

  const handleCancel = () => {
    setEditName(itemName);
    setEditCount(count);
    setIsEditing(false);
    setIsMenuOpen(false);
  };

  const handleRemove = () => {
    if (window.confirm(`Opravdu smazat "${itemName}"?`)) {
      console.log("Removing item with ID:", itemId);
      dispatch({ type: "REMOVE_ITEM", payload: { itemId } });
    }
    setIsMenuOpen(false);
  };

  return (
    <li
      className={`
        flex justify-between items-center py-2.5 border-b border-dotted border-gray-300
        ${isResolved ? "opacity-60 bg-gray-50" : ""}
      `}
    >
      {/* ---------- Left: Text or Edit Mode ---------- */}
      {isEditing ? (
        <div className="flex gap-2 flex-1">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            autoFocus
            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={editCount}
            onChange={(e) => setEditCount(Math.max(1, Number(e.target.value)))}
            min="1"
            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ) : (
        <span
          className={`
            flex-1 font-medium text-gray-900
            ${isResolved ? "font-normal text-gray-700" : ""}
          `}
        >
          <strong>{itemName}</strong> × {count}
          {isResolved && <em className="ml-2 text-gray-600">(Solved)</em>}
        </span>
      )}

      {/* ---------- Right: Checkbox + Menu ---------- */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isResolved}
          onChange={handleToggle}
          disabled={!isManager}
          className={`
            w-5 h-5 rounded cursor-pointer
            ${!isManager ? "cursor-not-allowed opacity-50" : ""}
          `}
        />

        {isManager && (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsMenuOpen((p) => !p)}
              className="p-1 text-lg text-gray-700 hover:bg-gray-200 rounded"
            >
              ⋮
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-6 bg-white border border-gray-300 rounded-lg shadow-md min-w-[120px] z-50">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      Edit Edit
                    </button>
                    <button
                      onClick={handleRemove}
                      className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

ItemRow.propTypes = {
  item: PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    isResolved: PropTypes.bool.isRequired,
  }).isRequired,
  isManager: PropTypes.bool.isRequired,
};
