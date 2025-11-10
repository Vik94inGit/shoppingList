// src/components/shoppingList/ItemsList.jsx (VYČIŠTĚNÁ VERZE)

import React from "react";
import ItemRow from "./ItemRow";
// POZNÁMKA: useState a PropTypes již nejsou potřeba, protože se nepoužívají.

// Komponenta pro vykreslení PŘEDFILTROVANÉHO seznamu položek.
// Přijímá: items (již filtrované pole položek), isManager (boolean), dispatch (funkce pro akce).
export default function ItemsList({
  items, // <--- PŘEDFILTROVANÉ POLOŽKY
  dispatch,
}) {
  // ❗ Odstraněny zakomentované a nepoužívané proměnné (filter, resolvedCount, activeCount)

  // ❗ Odstraněna nepoužívaná funkce handleFilterChange, jelikož setFilter neexistuje.
  // const handleFilterChange = (newFilter) => { setFilter(newFilter); };

  return (
    <div>
      {/* ❗ Odstraněno nefunkční Renderování přepínače filtrů ❗
      <div style={{ marginBottom: "10px" }}> ... </div>
      */}

      {/* Používáme ItemsWrapper ze styled components, pokud je dostupný, jinak standardní <ul> */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.length > 0 ? (
          // Mapování a vykreslení filtrovaných položek.
          items.map((item) => (
            <ItemRow key={item.itemId} item={item} dispatch={dispatch} />
          ))
        ) : (
          // Zpráva, pokud po filtrování nejsou žádné položky k zobrazení.
          <p
            style={{ color: "#6c757d", marginTop: "16px", fontStyle: "italic" }}
          >
            Seznam je prázdný, nebo jsou všechny položky skryty filtrem.{" "}
          </p>
        )}
      </ul>
    </div>
  );
}
