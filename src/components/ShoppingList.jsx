import { useState } from "react";
import { useShoppingList } from "../context/shoppingListContext";
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
  const { listData, dispatch, userId } = useShoppingList();
  const { name, items, shopListId, members, ownerId } = listData;

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

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white relative">
      {/* ---------- Header ---------- */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">{name}</h1>

      {/* ---------- Popover trigger ---------- */}
      <button
        onClick={() => setIsPopoverOpen((p) => !p)}
        className="absolute right-4 top-6 text-xl font-bold hover:text-gray-600"
      >
        •••
      </button>

      {/* ---------- Popover ---------- */}
      {isPopoverOpen && (
        <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] p-2 z-50">
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
            className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100"
          >
            Manage Members
          </button>

          {isOwner && (
            <>
              <EditName
                name={name}
                ownerId={ownerId}
                userId={userId}
                dispatch={dispatch}
                shopListId={shopListId}
              >
                Rename List
              </EditName>

              <button
                onClick={resetListToDefault}
                className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100"
              >
                Reset List
              </button>

              <DeleteListButton
                userId={userId}
                ownerId={ownerId}
                dispatch={dispatch}
                shopListId={shopListId}
              />
            </>
          )}
        </div>
      )}

      {/* ---------- Members list (absolute) ---------- */}
      {isMembersListVisible && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-40">
          <MemberList
            members={members}
            ownerId={ownerId}
            userId={userId}
            dispatch={dispatch}
          />
        </div>
      )}

      {/* ---------- Items ---------- */}
      <ItemsList
        items={filteredItems}
        isManager={isManager}
        dispatch={dispatch}
      />

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
