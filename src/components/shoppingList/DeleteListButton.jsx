// src/components/shoppingList/DeleteListButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useShoppingList } from "../../context/ShoppingListContext.jsx";
import { useTranslation } from "react-i18next";

export function DeleteListButton({ shopListId, dispatch }) {
  const { t } = useTranslation();
  const { actions } = useShoppingList();
  const navigate = useNavigate();

  if (!shopListId) {
    console.error("DeleteListButton: missing shopListId");
    return null;
  }

  const handleDelete = async (e) => {
    e.stopPropagation(); // ← prevent card navigation

    const confirmed = window.confirm(t("pages.shoppingList.deleteConfirm"));

    if (confirmed) {
      try {
        await actions.deleteListById(shopListId);
        navigate("/");
      } catch (err) {
        alert(t("pages.shoppingList.deleteError"));
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="w-7 h-7 flex items-center justify-center rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-base"
      aria-label={t("pages.shoppingList.deleteAria")}
    >
      🗑
    </button>
  );
}
