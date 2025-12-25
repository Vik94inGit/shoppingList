// src/components/shoppingList/CreateItemForm.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { actionTypes } from "../../context/ReducerHelper";
import { useShoppingList } from "../../context/ShoppingListContext";

export function CreateItem({ shopListId }) {
  const { actions } = useShoppingList();
  const [newName, setNewName] = useState("");
  const [newCount, setNewCount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleAdd = async () => {
    if (!newName.trim()) return;
    setIsLoading(true);
    try {
      await actions.addItem(shopListId, {
        itemName: newName.trim(),
        count: newCount ? Number(newCount) : 1,
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
    <div className="flex gap-2 mt-6">
      <input
        type="text"
        placeholder="Item name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Count"
        value={newCount}
        onChange={(e) => setNewCount(e.target.value)}
        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        min={0}
      />
      <button
        onClick={handleAdd}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Add
      </button>
    </div>
  );
}

CreateItem.propTypes = {
  userId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};
