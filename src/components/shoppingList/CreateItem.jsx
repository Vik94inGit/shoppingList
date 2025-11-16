// src/components/shoppingList/CreateItemForm.jsx
import { useState } from "react";
import PropTypes from "prop-types";

const baseStyles = {
  container: {
    margin: "20px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #dee2e6",
  },
  title: {
    margin: "0 0 12px 0",
    color: "#1c1d1eff",
    fontSize: "1.1rem",
  },
};
export default function CreateItem({ userId, dispatch, shopListId }) {
  const [newName, setNewName] = useState("");
  const [newCount, setNewCount] = useState("");
  const handleAdd = (payload) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        shopListId,
        itemId: `${shopListId}-item-${Date.now()}`,
        itemName: newName,
        count: newCount,
        userId,
      },
    });
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
