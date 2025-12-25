// src/components/shoppingList/ItemsList.jsx (VYČIŠTĚNÁ VERZE)

import React from "react";
import ItemRow from "./ItemRow";
// POZNÁMKA: useState a PropTypes již nejsou potřeba, protože se nepoužívají.

// Komponenta pro vykreslení PŘEDFILTROVANÉHO seznamu položek.
// Přijímá: items (již filtrované pole položek), isManager (boolean), dispatch (funkce pro akce).
export default function ItemList({
  items, // <--- PŘEDFILTROVANÉ POLOŽKY
  dispatch,
  shopListId,
}) {
  console.log(
    "Rendering ItemList with items:",
    items,
    "for list:",
    shopListId,
    "excluding itemIds:",
    items.map((i) => i.itemId)
  );
  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.length > 0 ? (
          // Mapování a vykreslení filtrovaných položek.
          items.map((item) => (
            <ItemRow
              key={`${shopListId}-${item.itemId || item._id} `}
              item={item}
              dispatch={dispatch}
            />
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
