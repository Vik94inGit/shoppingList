import { useState } from "react";
import { useShoppingList } from "../context/ShoppingListContext";
import { EditName } from "./shoppingList/EditName";
import { DeleteListButton } from "./shoppingList/DeleteListButton";
import { useParams } from "react-router-dom";
import MemberList from "./shoppingList/MemberList";
import ItemList from "./shoppingList/ItemList"; // 👈 import ItemsList
import CreateItem from "./shoppingList/CreateItem";

const FilterOptions = ["All", "Unsolved", "Solved"];

export function ShoppingList() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const [isMembersListVisible, setIsMembersListVisible] = useState(false);
  const { listId } = useParams(); // ← from URL: /list/sl-3
  const { state, currentUserId, dispatch } = useShoppingList();
  const { lists } = state;

  const list = lists.find((l) => l.shopListId === listId || l.id === listId);

  // Loading / Not found
  if (!list) {
    return <p className="p-4 text-red-600">Seznam nenalezen.</p>;
  }
  const { name, ownerId, members = [], items = [], shopListId } = list;

  const userId = list.currentUserId;
  console.log("listData in ShoppingList", list);
  console.log(members, "members in ShoppingList");
  // determine if current user can manage items

  const isOwner = ownerId === currentUserId;
  const isMember = members.some((m) => m.userId === currentUserId);
  const isManager = isOwner || isMember;
  console.log("[ShoppingList] listData:", list);

  const resetListToDefault = () => {
    // Optional: ask the user to confirm – prevents accidental wipes
    const confirmed = window.confirm(
      "Opravdu chcete resetovat seznam na výchozí stav? Všechny změny budou ztraceny."
    );

    if (!confirmed) return;
    console.log("[Component] Dispatching RESET_LIST");
    dispatch({ type: "RESET_LIST", payload: { listId } });
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
    <div className="p-4">
      <header className="flex justify-between items-center mb-4 relative">
        {/* ---------- Header ---------- */}
        {isOwner ? (
          <div className="flex gap-4">
            <EditName
              name={name}
              ownerId={ownerId}
              dispatch={dispatch}
              shopListId={shopListId}
            >
              <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            </EditName>
            <DeleteListButton
              userId={currentUserId}
              ownerId={ownerId}
              dispatch={dispatch}
            />
          </div>
        ) : (
          // Non-owner view: just the name
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        )}
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
                userId={currentUserId}
                dispatch={dispatch}
              />
            </div>
          </div>
        )}
      </header>

      {/* ---------- Items ---------- */}
      <ItemList items={filteredItems} dispatch={dispatch} />

      {/* ---------- Add new item ---------- */}
      {isManager && <CreateItem userId={currentUserId} dispatch={dispatch} />}
    </div>
  );
}
