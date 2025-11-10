// src/components/shoppingList/CreateItemForm.jsx
import React from "react";
import PropTypes from "prop-types";
import ItemForm from "./ItemForm";
import useBreakpoint from "../../hooks/useBreakpoint"; // ← global

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
export default function CreateItemForm({ userId, dispatch }) {
  const { sm, lg } = useBreakpoint(); // ← global hook

  const containerStyle = {
    ...baseStyles.container,
    ...(sm && { padding: "20px", margin: "30px" }),
    ...(lg && { padding: "30px", margin: "40px", maxWidth: "600px" }),
  };

  const titleStyle = {
    ...baseStyles.title,
    ...(sm && { fontSize: "1.25rem" }),
    ...(lg && { fontSize: "1.4rem" }),
  };
  const handleAdd = (payload) => {
    dispatch({ type: "ADD_ITEM", payload });
  };

  return (
    <div style={containerStyle} className="create-item-form">
      <h4 style={titleStyle}>Add new item</h4>
      <ItemForm onSubmit={handleAdd} submitLabel="Add" />
    </div>
  );
}

CreateItemForm.propTypes = {
  userId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};
