// src/components/shoppingList/CreateItemForm.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { actionTypes } from "../../context/ReducerHelper";
import { useShoppingList } from "../../context/ShoppingListContext";
import { useTranslation } from "react-i18next";

export function CreateItem({ shopListId }) {
  const { actions } = useShoppingList();
  const [newName, setNewName] = useState("");
  const [newCount, setNewCount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const handleAdd = async () => {
    const trimmedName = newName.trim();
    const countNum = Number(newCount);

    if (!trimmedName || trimmedName.length > 100) {
      alert("Název musí mít 1 až 100 znaků.");
      return;
    }

    if (isNaN(countNum) || countNum < 0 || countNum > 99999) {
      alert("Množství musí být číslo mezi 1 a 99 999.");
      return;
    }

    if (!newName.trim()) return;
    setIsLoading(true);
    try {
      await actions.addItem(shopListId, {
        itemName: newName.trim(),
        count: newCount ? Number(newCount) : 1,
        isResolved: false,
      });

      setNewName("");
      setNewCount("");
    } catch (err) {
      // Handle error (e.g. show toast)
      alert("Failed to add item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <input
        type="text"
        placeholder={t("components.createItem.placeholder.name")}
        aria-label={t("components.createItem.placeholder.name")}
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="flex-1 px-5 py-3 text-base bg-white dark:bg-gray-800 
               border border-gray-300 dark:border-gray-600 
               rounded-xl 
               placeholder-gray-500 dark:placeholder-gray-400 
               text-gray-900 dark:text-gray-100 
               focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
               focus:border-transparent 
               transition-all duration-200"
      />
      <input
        type="number"
        placeholder={t("components.createItem.placeholder.count")}
        aria-label={t("components.createItem.placeholder.count")}
        value={newCount}
        onChange={(e) => setNewCount(e.target.value)}
        className="w-full sm:w-32 px-5 py-3 text-base bg-white dark:bg-gray-800 
               border border-gray-300 dark:border-gray-600 
               rounded-xl 
               placeholder-gray-500 dark:placeholder-gray-400 
               text-gray-900 dark:text-gray-100 
               focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
               focus:border-transparent 
               transition-all duration-200"
        min={0}
      />
      <button
        onClick={handleAdd}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed 
               text-white font-medium rounded-xl 
               shadow-md hover:shadow-lg 
               transition-all duration-200 
               focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 
               whitespace-nowrap"
      >
        {t("components.createItem.addButton")}
      </button>
    </div>
  );
}

CreateItem.propTypes = {
  userId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};
