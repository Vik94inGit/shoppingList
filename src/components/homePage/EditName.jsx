// src/components/shoppingList/EditName.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { actionTypes } from "../../context/ReducerHelper";
import { useShoppingList } from "../../context/ShoppingListContext.jsx";

export function EditName({ name, shopListId, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const { actions, lists } = useShoppingList();
  const { updateById } = actions;
  const list = lists.find((l) => l.shopListId === shopListId);

  console.log("isOwner:", isOwner);
  console.log("list in EditName", list);
  console.log("list.isArchived in EditName", list.isArchived);

  useEffect(() => {
    setNewName(name);
  }, [name]);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setNewName(name);
  };

  const handleInputChange = (e) => {
    e.stopPropagation();
    const value = e.target.value;
    setNewName(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const trimmed = newName.trim();
    if (!trimmed) return;
    console.log("updared name for Backend", list.isArchived);
    try {
      // We don't need to dispatch here anymore because updateById handles it!
      await updateById(shopListId, {
        name: trimmed,
        isArchived: list.isArchived,
      });

      setIsEditing(false);
    } catch (error) {
      // Handle error (maybe show a toast)
    }
  };

  // HANDLE CANCEL
  const handleCancel = (e) => {
    e.stopPropagation();
    setIsEditing(false);
    setNewName(name);
  };

  // OWNER VIEW
  return (
    <div>
      {isEditing ? (
        <form
          className="flex gap-4"
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
        >
          {/* <h3 className="text-2xl font-bold text-gray-900 flex-1 dark:text-white">
            {name}
          </h3> */}
          <input
            type="text"
            className="border p-1 rounded"
            value={newName}
            onClick={(e) => e.stopPropagation()}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Escape" && handleCancel(e)}
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
          {isOwner && (
            <div onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={handleEditClick}
                className="w-7 h-7 flex items-center justify-center rounded-md text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors text-sm"
              >
                ✎
              </button>
            </div>
          )}
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
