// src/components/shoppingList/ItemsList.jsx (VYČIŠTĚNÁ VERZE)

import React from "react";
import ItemRow from "./ItemRow";
import { useTranslation } from "react-i18next";

// Komponenta pro vykreslení PŘEDFILTROVANÉHO seznamu položek.
// Přijímá: items (již filtrované pole položek), isManager (boolean), dispatch (funkce pro akce).
export default function ItemList({
  items, // <--- PŘEDFILTROVANÉ POLOŽKY
  dispatch,
  shopListId,
}) {
  const { t } = useTranslation();
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
      <ul className="space-y-3 list-none p-0">
        {items.length > 0 ? (
          items.map((item) => (
            <ItemRow
              key={`${shopListId}-${item.itemId || item._id}`}
              item={item}
              dispatch={dispatch}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8 italic text-lg">
            {t("pages.shoppingList.emptyMessage")}
          </p>
        )}
      </ul>
    </div>
  );
}
