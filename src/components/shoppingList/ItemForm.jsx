// src/components/shoppingList/forms/ItemForm.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * ITEMFORM – REUSABLE FORM FOR CREATE & EDIT
 *
 * PURPOSE:
 * - Used in CreateItemForm (new item)
 * - Used in ItemRow (edit mode)
 *
 * DATAFLOW:
 * 1. Props → `initialName`, `initialCount`, `onSubmit`, `onCancel`, `submitLabel`
 * 2. State → `name`, `count` (initialized from props)
 * 3. Input → real-time update + LOG
 * 4. Submit → validate → onSubmit(payload) + LOG
 * 5. Cancel → onCancel() + LOG
 *
 * LOGS: `[ItemForm]` prefix
 */
export default function ItemForm({
  initialName = "",
  initialCount = 1,
  onSubmit,
  onCancel,
  submitLabel = "Uložit",
}) {
  const [name, setName] = useState(initialName);
  const [count, setCount] = useState(initialCount);

  // INPUT HANDLERS
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
  };

  const handleCountChange = (e) => {
    const raw = e.target.value;
    const enforced = raw === "" ? "" : Math.max(1, Number(raw));
    setCount(enforced);
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      console.log(`[ItemForm] Validation FAILED: empty name`);
      return;
    }

    const parsedCount = parseInt(count, 10) || 1;

    const payload = { itemName: trimmed, count: parsedCount };

    onSubmit(payload);
  };

  // CANCEL
  const handleCancel = () => {
    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "end",
        flexWrap: "wrap",
      }}
      aria-label="Formulář pro položku"
    >
      {/* NAME INPUT */}
      <div style={{ flexGrow: 1, minWidth: "180px" }}>
        <input
          type="text"
          placeholder="Název položky"
          value={name}
          onChange={handleNameChange}
          required
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #ced4da",
            borderRadius: "4px",
            fontSize: "15px",
          }}
          aria-label="Název položky"
        />
      </div>

      {/* COUNT INPUT */}
      <div style={{ minWidth: "70px" }}>
        <input
          type="number"
          value={count}
          onChange={handleCountChange}
          min="1"
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #ced4da",
            borderRadius: "4px",
            fontSize: "15px",
            textAlign: "center",
          }}
          aria-label="Počet kusů"
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={!name.trim()}
        style={{
          backgroundColor: name.trim() ? "#28a745" : "#c8e6c9",
          color: "gray",
          border: "none",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: name.trim() ? "pointer" : "not-allowed",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        {submitLabel}
      </button>

      {/* CANCEL */}
      {onCancel && (
        <button
          type="button"
          onClick={handleCancel}
          style={{
            backgroundColor: "#6c757d",
            color: "gray",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Zrušit
        </button>
      )}
    </form>
  );
}

// PropTypes
ItemForm.propTypes = {
  initialName: PropTypes.string,
  initialCount: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  submitLabel: PropTypes.string,
};

ItemForm.defaultProps = {
  initialName: "",
  initialCount: 1,
  onCancel: null,
  submitLabel: "Uložit",
};
