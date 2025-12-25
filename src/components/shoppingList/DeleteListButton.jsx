// src/components/shoppingList/DeleteListButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useShoppingList } from "../../context/ShoppingListContext.jsx";

export function DeleteListButton({ shopListId, dispatch }) {
  const { actions } = useShoppingList();
  const navigate = useNavigate();

  if (!shopListId) {
    console.error("DeleteListButton: missing shopListId");
    return null;
  }

  const handleDelete = async (e) => {
    e.stopPropagation(); // ← prevent card navigation

    const confirmed = window.confirm(
      "Opravdu chcete smazat nákupní seznam? Tato akce je nevratná."
    );

    if (confirmed) {
      try {
        await actions.deleteListById(shopListId);
        navigate("/");
      } catch (err) {
        alert("Smazání selhalo. Zkuste znovu.");
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800 text-2xl"
      aria-label="Smazat seznam"
    >
      🗑️
    </button>
  );
}
