// src/components/shoppingList/CreateItemForm.jsx
import React from "react";
import PropTypes from "prop-types";
import ItemForm from "./ItemForm";

/**
 * CREATEITEMFORM – WRAPPER FOR ADDING NEW ITEM
 * Uses reusable <ItemForm />
 */
export default function CreateItemForm({ userId, dispatch }) {
  const handleAdd = (payload) => {
    dispatch({ type: "ADD_ITEM", payload });
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #dee2e6",
      }}
    >
      <h4 style={{ margin: "0 0 12px 0", color: "#495057" }}>Add new item</h4>
      <ItemForm onSubmit={handleAdd} submitLabel="Přidat" />
    </div>
  );
}

CreateItemForm.propTypes = {
  userId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};
