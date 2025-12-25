import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useShoppingList } from "../../context/ShoppingListContext";
import { useParams } from "react-router-dom";
import { actionTypes } from "../../context/ReducerHelper";
import { deleteItem, updateItem } from "../shoppingList/useShoppingList";
export default function ItemRow({ item }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.itemName);
  const [editCount, setEditCount] = useState(item.count);

  const { lists, currentUserId, dispatch } = useShoppingList();

  const { shopListId } = useParams(); // ← from URL: /list/sl-3
  const list = lists.find(
    (l) => l.shopListId === shopListId || l.id === shopListId
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  // ← Wrap in useCallback to stabilize reference
  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  }, []); // ← No dependencies! setIsMenuOpen is stable

  const isMember = list.members.some((m) => m.userId === currentUserId);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]); // ← Only re-subscribe if handler changes

  if (!item || !item.itemId) return null;
  const { itemId, itemName, count, isResolved } = item;

  const handleToggle = async () => {
    console.log(itemId);
    const trimmedName = editName.trim();
    const itemData = {
      itemName: trimmedName,
      count: Number(editCount) || 1,
      isResolved: !isResolved,
    };
    await updateItem(shopListId, itemId, itemData);
    dispatch({
      type: actionTypes.toggleItemResolved,
      payload: { shopListId, itemId },
    });
  };

  const handleSave = async () => {
    const trimmedName = editName.trim();
    if (!trimmedName) return;

    try {
      const shopListId = list.shopListId;
      const itemData = {
        itemName: trimmedName,
        count: Number(editCount) || 1,
      };
      // 1. Call the Database first
      await updateItem(shopListId, itemId, itemData);
      dispatch({
        type: actionTypes.updateItem,
        payload: {
          itemId,
          itemName: trimmedName,
          count: Number(editCount) || 1,
          shopListId,
        },
      });
      setIsEditing(false);
      setIsMenuOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Nepodařilo se aktualizovat položku.");
    }
  };

  const handleCancel = () => {
    setEditName(itemName);
    setEditCount(count);
    setIsEditing(false);
    setIsMenuOpen(false);
  };

  const handleRemove = async () => {
    if (!window.confirm(`Opravdu smazat "${itemName}"?`)) return;

    try {
      // 1. Call the Database first
      await deleteItem(shopListId, itemId);

      // 2. If successful, update the UI state
      dispatch({
        type: actionTypes.removeItem,
        payload: { itemId, shopListId },
      });
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Nepodařilo se smazat položku.");
    } finally {
      setIsMenuOpen(false);
    }
  };

  // Loading / Not found
  if (!list) {
    return <p className="p-4 text-red-600">Seznam nenalezen.</p>;
  }

  if (isMember) {
    return (
      <li
        ref={menuRef}
        className={`
        flex justify-between items-center py-2 border-b gap-2
        ${isResolved ? "bg-gray-50" : ""}
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
              onChange={(e) =>
                setEditCount(Math.max(1, Number(e.target.value)))
              }
              min="1"
              className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          <span>
            <span
              className={`
            flex-1 font-medium text-gray-900
            ${isResolved ? "font-normal text-gray-700 line-through" : ""}
          `}
            >
              <strong>{itemName}</strong> × {count}
            </span>
            {isResolved && <em className="ml-2 text-gray-600">(Solved)</em>}
          </span>
        )}

        {/* ---------- Right: Checkbox + Menu ---------- */}
        <div className="flex items-center gap-2 relative">
          <input
            type="checkbox"
            checked={isResolved}
            onChange={handleToggle}
            className={`
            w-5 h-5 rounded cursor-pointer
          `}
          />

          <button
            onClick={() => setIsMenuOpen((p) => !p)}
            className="p-1 text-lg text-gray-700 hover:bg-gray-200 rounded"
          >
            ⋮
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-6 bg-white border  rounded-lg shadow-md min-w-[120px] z-50">
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
                    Edit
                  </button>
                  <button
                    onClick={handleRemove}
                    className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </li>
    );
  }
}

ItemRow.propTypes = {
  item: PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    isResolved: PropTypes.bool.isRequired,
  }).isRequired,
};
