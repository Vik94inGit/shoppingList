// src/components/shoppingList/EditName.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { actionTypes } from "../../context/ReducerHelper";
import { useShoppingList } from "../../context/ShoppingListContext.jsx";

export function EditName({ name, shopListId, dispatch, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const { actions } = useShoppingList();
  const { updateById } = actions;

  console.log("isOwner:", isOwner);

  useEffect(() => {
    setNewName(name);
  }, [name]);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setNewName(name);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewName(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const trimmed = newName.trim();

    if (!trimmed) {
      return;
    }
    await updateById(shopListId, { name: trimmed });
    dispatch({
      type: actionTypes.renameList,
      payload: { shopListId, newName: trimmed },
    });

    setIsEditing(false);
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
        <form className="flex gap-4" onSubmit={handleSubmit}>
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
          <h3 className="text-2xl font-bold text-gray-900 flex-1">{name}</h3>
          {isOwner && (
            <button
              type="button"
              onClick={handleEditClick}
              className="mt-4 flex justify-end"
            >
              ✏️
            </button>
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
