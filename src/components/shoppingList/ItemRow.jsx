import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { useShoppingList } from "../../context/ShoppingListContext";
import { useParams } from "react-router-dom";
import { actionTypes } from "../../context/ReducerHelper";
import { deleteItem, updateItem } from "../shoppingList/useShoppingList";

export default function ItemRow({ item }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.itemName);
  const [editCount, setEditCount] = useState(item.count);
  const { t } = useTranslation();

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]); // ← Only re-subscribe if handler changes

  const idToUse = item?.itemId || item?._id;
  if (!item || !idToUse) return null;
  const { itemId, itemName, count, isResolved } = item;
  console.log("what item contains in itemRow", item);
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

  return (
    <li
      ref={menuRef}
      className={`
      flex justify-between items-center py-4 px-2 border-b border-gray-200 dark:border-gray-700 gap-4
      transition-colors duration-200
      ${
        isResolved
          ? "bg-gray-50 dark:bg-gray-800/50 opacity-80"
          : "bg-white dark:bg-gray-900"
      }
    `}
    >
      {/* Left: Name + Count (or Edit Mode) */}
      <div className="flex-1 min-w-0">
        {" "}
        {/* min-w-0 prevents flex overflow */}
        {isEditing ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              autoFocus
              className="flex-1 px-4 py-2.5 text-base bg-white dark:bg-gray-800 
                       border border-gray-300 dark:border-gray-600 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                       text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder={t("components.itemRow.editPlaceholder.name")}
            />
            <input
              type="number"
              value={editCount}
              onChange={(e) =>
                setEditCount(Math.max(1, Number(e.target.value) || 1))
              }
              min="1"
              className="w-28 px-4 py-2.5 text-base bg-white dark:bg-gray-800 
                       border border-gray-300 dark:border-gray-600 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                       text-gray-900 dark:text-white"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span
              className={`
              font-medium text-lg text-gray-900 dark:text-gray-100 truncate
              ${
                isResolved
                  ? "line-through text-gray-500 dark:text-gray-400"
                  : ""
              }
            `}
            >
              {itemName} × {count}
            </span>
            {isResolved && (
              <span className="text-sm italic text-gray-500 dark:text-gray-400">
                ({t("components.itemRow.resolved")})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right: Checkbox + Menu Button */}
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={isResolved}
          onChange={handleToggle}
          className="w-6 h-6 rounded text-blue-600 focus:ring-blue-500 
                   cursor-pointer transition"
          aria-label={t("components.itemRow.toggleResolved")}
        />

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 
                     rounded-lg transition-colors duration-200"
            aria-label={t("components.itemRow.menu.open")}
          >
            ⋮
          </button>

          {isMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 
                       border border-gray-200 dark:border-gray-700 
                       rounded-xl shadow-xl overflow-hidden z-50"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="w-full text-left px-4 py-3 text-sm font-medium 
                             text-gray-700 dark:text-gray-200 
                             hover:bg-gray-100 dark:hover:bg-gray-700 
                             transition"
                  >
                    {t("components.itemRow.menu.save")}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="w-full text-left px-4 py-3 text-sm font-medium 
                             text-gray-700 dark:text-gray-200 
                             hover:bg-gray-100 dark:hover:bg-gray-700 
                             transition"
                  >
                    {t("components.itemRow.menu.cancel")}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full text-left px-4 py-3 text-sm font-medium 
                             text-gray-700 dark:text-gray-200 
                             hover:bg-gray-100 dark:hover:bg-gray-700 
                             transition"
                  >
                    {t("components.itemRow.menu.edit")}
                  </button>
                  <button
                    onClick={handleRemove}
                    className="w-full text-left px-4 py-3 text-sm font-medium 
                             text-red-600 dark:text-red-400 
                             hover:bg-red-50 dark:hover:bg-red-900/30 
                             transition"
                  >
                    {t("components.itemRow.menu.delete")}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
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
};
