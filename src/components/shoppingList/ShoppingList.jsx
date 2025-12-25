// src/pages/ShoppingList.jsx (or wherever it is)
import { useState } from "react";
import { useParams, Link } from "react-router-dom"; // ← use Link instead of <a href>
import { useShoppingList } from "../../context/ShoppingListContext";
import { EditName } from "../homePage/EditName";
import { DeleteListButton } from "./DeleteListButton.jsx";
import { MemberList } from "./MemberList";
import ItemList from "./ItemList";
import { CreateItem } from "./CreateItem";

const FilterOptions = ["All", "Unsolved", "Solved"];

export function ShoppingList() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isMembersListVisible, setIsMembersListVisible] = useState(false);

  const { shopListId } = useParams(); // e.g. /list/694923ecf8674cd317b3ac0a
  const { lists, currentUser, dispatch } = useShoppingList();
  const currentUserId = currentUser?.id;

  const list = lists.find((l) => l.shopListId === shopListId);

  if (!list) {
    return <p className="p-4 text-red-600 text-center">Seznam nenalezen.</p>;
  }

  const { name, ownerId, members = [], items = [], shopListId: listId } = list;

  const isOwner = ownerId === currentUserId;
  const isMember = members.some((m) => m.userId === currentUserId);
  const isManager = isOwner || isMember;

  const filteredItems = items.filter((item) => {
    if (activeFilter === "Solved") return item.isResolved;
    if (activeFilter === "Unsolved") return !item.isResolved;
    return true;
  });

  const toggleMembers = () => setIsMembersListVisible((prev) => !prev);

  const resetListToDefault = () => {
    if (
      window.confirm(
        "Opravdu chcete resetovat seznam na výchozí stav? Všechny změny budou ztraceny."
      )
    ) {
      dispatch({ type: "resetList", payload: { shopListId } });
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Back button - use Link for better React Router experience */}
      <Link to="/" className="inline-block mb-4 text-blue-600 hover:underline">
        ← Zpět na seznamy
      </Link>

      <header className="flex justify-between items-center mb-6 relative">
        {/* Title + Edit/Delete for owner */}
        {isOwner ? (
          <div className="flex items-center gap-6">
            <EditName
              name={name}
              shopListId={shopListId}
              dispatch={dispatch}
              isOwner={true}
            >
              <h1 className="text-3xl font-bold text-gray-900">
                {name} "8999"
              </h1>
            </EditName>

            <DeleteListButton shopListId={shopListId} dispatch={dispatch} />
          </div>
        ) : (
          <h1 className="text-3xl font-bold text-gray-900">{name} "8999"</h1>
        )}

        {/* Popover menu button */}
        <button
          onClick={() => setIsPopoverOpen((p) => !p)}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
          aria-label="Menu"
        >
          ⋯
        </button>

        {/* Popover */}
        {isPopoverOpen && (
          <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px] p-3 z-50">
            {FilterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setIsPopoverOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition ${
                  activeFilter === filter ? "bg-gray-100 font-semibold" : ""
                }`}
              >
                Zobrazit:{" "}
                {filter === "All"
                  ? "Vše"
                  : filter === "Solved"
                  ? "Vyřešené"
                  : "Nevyřešené"}
              </button>
            ))}

            <hr className="my-2 border-gray-200" />

            <button
              onClick={toggleMembers}
              className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition ${
                isMembersListVisible ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              Spravovat členy
            </button>

            <button
              onClick={resetListToDefault}
              className="block w-full text-left px-4 py-2 rounded hover:bg-red-50 text-red-600 transition"
            >
              Resetovat seznam
            </button>
          </div>
        )}
      </header>

      {/* Members overlay */}
      {isMembersListVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Členové seznamu</h2>
              <button
                onClick={toggleMembers}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <MemberList
              members={members}
              ownerId={ownerId}
              currentUserId={currentUserId}
              dispatch={dispatch}
              shopListId={shopListId}
            />
          </div>
        </div>
      )}

      {/* Items list */}
      <ItemList
        items={filteredItems}
        dispatch={dispatch}
        shopListId={shopListId}
      />

      {/* Add new item - only for manager */}
      {isManager && (
        <div className="mt-8">
          <CreateItem
            userId={currentUserId}
            dispatch={dispatch}
            shopListId={shopListId}
          />
        </div>
      )}
    </div>
  );
}
