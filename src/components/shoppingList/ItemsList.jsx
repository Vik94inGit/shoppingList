// src/components/shoppingList/ItemsList.jsx (AKTUALIZOVÁNO)

import React from "react";
import ItemRow from "./ItemRow"; // POZNÁMKA: Mělo by být "ItemRow", ne "MemberRow". Předpokládám, že jste to v projektu správně přejmenoval.
import PropTypes from "prop-types"; // Import pro kontrolu typů (i když se nepoužívá, je tam).
import { useState } from "react"; // Import hooku pro správu lokálního stavu.

// Komponenta pro vykreslení seznamu položek s možností filtrování.
// Přijímá: items (pole položek), isManager (boolean), dispatch (funkce pro akce).
export default function ItemsList({
  items,
  isManager,
  dispatch, // <--- PŘIJÍMÁME DISPATCH
}) {
  const [filter, setFilter] = useState("all"); // Výpočet počtu položek v různých stavech pro zobrazení a logiku.

  const resolvedCount = items.filter((i) => i.isResolved).length;
  const activeCount = items.length - resolvedCount; // --- FILTER LOGIC (Logika filtrování seznamu) ---

  const filteredItems = (() => {
    switch (filter) {
      case "active": // Vrací pouze nevyřešené (aktivní) položky.
        return items.filter((i) => !i.isResolved);
      case "resolved": // Vrací pouze vyřešené položky.
        return items.filter((i) => i.isResolved);
      case "all":
      default: // Vrací všechny položky.
        return items;
    }
  })(); // Logování stavu filtru a výsledku filtrování.

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div>
      {/* --- Renderování přepínače filtrů --- */}
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => handleFilterChange("all")}
          style={{
            fontWeight: filter === "all" ? "bold" : "normal",
            marginRight: "5px",
          }}
        >
          Vše ({items.length})
        </button>
        <button
          onClick={() => handleFilterChange("active")}
          style={{
            fontWeight: filter === "active" ? "bold" : "normal",
            marginRight: "5px",
          }}
        >
          Aktivní ({activeCount})
        </button>
        <button
          onClick={() => handleFilterChange("resolved")}
          style={{ fontWeight: filter === "resolved" ? "bold" : "normal" }}
        >
          Vyřešeno ({resolvedCount})
        </button>
      </div>{" "}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {" "}
        {filteredItems.length > 0 ? (
          // Mapování a vykreslení filtrovaných položek.
          filteredItems.map((item) => (
            <ItemRow
              key={item.itemId}
              item={item}
              isManager={isManager}
              dispatch={dispatch} // <--- PŘEDÁVÁME DISPATCH DO ITEMROW
            />
          ))
        ) : (
          // Zpráva, pokud po filtrování nejsou žádné položky k zobrazení.
          <p style={{ color: "#6c757d" }}>
            Seznam je prázdný, nebo jsou všechny položky skryty.{" "}
          </p>
        )}{" "}
      </ul>{" "}
    </div>
  );
}
