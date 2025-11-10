import { useState } from "react";
import { useShoppingList } from "../context/ShoppingListContext";
import { EditName } from "./shoppingList/EditName";
import { DeleteListButton } from "./shoppingList/DeleteListButton";

import { MemberList } from "./shoppingList/MemberList";
import ItemsList from "./shoppingList/ItemsList"; // 👈 import ItemsList

const FilterOptions = ["All", "Unsolved", "Solved"];

export function ShoppingList() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [newName, setNewName] = useState("");
  const [newCount, setNewCount] = useState("");
  const [isMembersListVisible, setIsMembersListVisible] = useState(false);
  const { listData, dispatch } = useShoppingList();
  const { name, items, shopListId, members, ownerId } = listData;

  const userId = listData.userId;

  // determine if current user can manage items
  const isOwner = ownerId === userId;
  const isMember = members.some((m) => m.userId === userId);
  const isManager = isOwner || isMember;

  const handleAddItem = () => {
    // 1. Validation check
    if (!newName) return;

    // 2. Dispatch action to reducer
    dispatch({
      type: "ADD_ITEM",
      payload: {
        shopListId,
        // ❗ IMPORTANT FIX: Pass the state values, NOT the setter functions!
        itemName: newName,
        count: newCount,
        userId,
      },
    });

    // 3. Reset local state
    setNewName("");
    setNewCount("");
  };

  const resetListToDefault = () => {
    // Optional: ask the user to confirm – prevents accidental wipes
    const confirmed = window.confirm(
      "Opravdu chcete resetovat seznam na výchozí stav? Všechny změny budou ztraceny."
    );

    if (!confirmed) return;

    dispatch({ type: "RESET_LIST" });
  };

  const filteredItems = items.filter((item) => {
    if (activeFilter === "Solved") return item.isResolved;
    if (activeFilter === "Unsolved") return !item.isResolved;
    return true; // "All"
  });

  const toggleMembers = () => {
    setIsMembersListVisible((p) => !p); // Toggle visibility
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Opravdu chcete smazat nákupní seznam? Tato akce je nevratná."
    );

    if (confirmed) {
      dispatch({ type: "DELETE_LIST" });
    }
  };

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-4 relative">
        {/* ---------- Header ---------- */}
        <div className="flex gap-4">
          <EditName
            name={name}
            ownerId={ownerId}
            userId={userId}
            dispatch={dispatch}
            shopListId={shopListId}
          >
            <h1 className="text-2xl font-bold text-gray-900 "> {name}</h1>
          </EditName>
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Smazat celý nákupní seznam"
          >
            Delete list
          </button>
        </div>
        <button
          onClick={() => setIsPopoverOpen((p) => !p)}
          className="border rounded-full w-8 h-8"
        >
          •••
        </button>
        {/* ---------- Popover ---------- */}
        {isPopoverOpen && (
          <div className="absolute top-10 right-0 bg-white border rounded-lg shadow-lg min-w-[180px] p-2 z-50">
            {/* Filters */}
            {FilterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setIsPopoverOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                  activeFilter === filter ? "font-bold bg-gray-100" : ""
                }`}
              >
                Show {filter}
              </button>
            ))}

            {/* Action buttons */}
            <button
              onClick={toggleMembers}
              className={`block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                isMembersListVisible ? "font-bold bg-gray-100" : ""
              }`}
            >
              Manage Members
            </button>

            <button
              onClick={resetListToDefault}
              className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100"
            >
              Reset List
            </button>
          </div>
        )}

        {/* ---------- Members list (absolute) ---------- */}
        {isMembersListVisible && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <MemberList
                members={members}
                ownerId={ownerId}
                userId={userId}
                dispatch={dispatch}
              />
            </div>
          </div>
        )}
      </header>

      {/* ---------- Items ---------- */}
      <ItemsList items={filteredItems} dispatch={dispatch} />

      {/* ---------- Add new item ---------- */}
      {isManager && (
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
            onClick={handleAddItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
