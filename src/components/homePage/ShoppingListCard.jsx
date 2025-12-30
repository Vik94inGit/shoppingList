import { actionTypes } from "../../context/ReducerHelper";
import { EditName } from "./EditName";
import { DeleteListButton } from "../shoppingList/DeleteListButton";
import { useShoppingList } from "../../context/ShoppingListContext";
import { useTranslation } from "react-i18next";
export default function ShoppingListCard({ list, isOwner, dispatch, onClick }) {
  const { shopListId, name, items, isArchived } = list;
  const { actions } = useShoppingList();
  const { archiveListById } = actions;
  const { t } = useTranslation();

  // 1. RECEIVE THE EVENT OBJECT 'e'
  const handleToggle = async (e) => {
    // 2. STOP BUBBLING IMMEDIATELY
    if (e) {
      e.stopPropagation();
    }

    const archived = !isArchived;

    try {
      await archiveListById(shopListId, {
        name: list.name,
        isArchived: archived,
      });
      console.log("Updated list archive status successfully");
    } catch (error) {
      console.error("Failed to update archive status:", error);
    }
  };

  return (
    <div
      onClick={onClick}
      className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative bg-white dark:bg-gray-800 dark:border-gray-700"
    >
      {/* KONTEJNER PRO NÁZEV A AKCE */}
      <div className="flex items-center justify-between gap-4 mb-1">
        <div className="flex items-center gap-3 overflow-hidden">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {name}
          </h3>

          {/* Tlačítka Edit a Delete hned u jména */}
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <EditName
              name={name}
              shopListId={shopListId}
              dispatch={dispatch}
              isOwner={isOwner}
            />
            {isOwner && (
              <DeleteListButton shopListId={shopListId} dispatch={dispatch} />
            )}
          </div>
        </div>
      </div>

      {/* POČET POLOŽEK */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {items.length}{" "}
        {items.length === 1
          ? t("components.shoppingListCard.items_count1")
          : items.length >= 2 && items.length <= 4
          ? t("components.shoppingListCard.item_few")
          : t("components.shoppingListCard.items_count2")}
      </p>

      {/* ARCHIVACE (Spodní část karty) */}
      <div className="flex items-center gap-2 mt-auto">
        <input
          type="checkbox"
          checked={isArchived}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleToggle(e)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {isArchived
            ? t("components.shoppingListCard.archived_label")
            : t("components.shoppingListCard.active_label")}
        </span>
      </div>
    </div>
  );
}
