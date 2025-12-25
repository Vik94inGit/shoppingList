// src/components/shoppingList/CreateListModal.jsx
import { useState, useCallback } from "react";

import { MemberList, MembersListContent } from "../shoppingList/MemberList";
import ItemList from "../shoppingList/ItemList"; // ← your ItemsList (renamed)
import { useShoppingList } from "../../context/ShoppingListContext.jsx";

export default function CreateListModal({ isOpen, onClose }) {
  const { currentUser, actions, dispatch } = useShoppingList();
  // Define currentUserId from the currentUser object safely
  const currentUserId = currentUser?.id;
  // ── Form state ─────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);

  // ── Dropdown state ─────────────────────────────────────────────────
  const [membersOpen, setMembersOpen] = useState(true);
  const [itemsOpen, setItemsOpen] = useState(true);

  const handleClose = useCallback(() => {
    setName("");
    setItems([]);
    setMembers([]);
    setMembersOpen(true);
    setItemsOpen(true);
    onClose();
  }, [currentUserId, onClose]);

  // ── Handlers ───────────────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) {
      alert("Zadejte název seznamu");
      return;
    }

    const newList = {
      name: name.trim(),
      members,
      items: items.map((i) => ({ ...i, isArchieved: false })),
    };
    try {
      console.log("Creating new list on frontend:", newList);
      await actions.createNewList(newList);
      handleClose(); // Reset state and close modal
    } catch (err) {
      alert("Nepodařilo se uložit seznam na server.");
    }
  }, [name, currentUser, members, items, actions, handleClose]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Vytvořit nový seznam
          </h2>

          {/* ── Name ── */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Název seznamu
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Např. Týdenní nákup"
            />
          </div>

          {/* ── Members Dropdown ── */}
          <div className="mb-4">
            <button
              onClick={() => setMembersOpen(!membersOpen)}
              className="w-full text-left px-4 py-2 bg-blue-50 rounded-t-md font-medium text-blue-700 hover:bg-blue-100 transition flex justify-between items-center"
            >
              Členové ({members.length})<span>{membersOpen ? "▲" : "▼"}</span>
            </button>
            {membersOpen && (
              <div className="border border-t-0 border-gray-300 rounded-b-md p-4 bg-gray-50">
                <MembersListContent
                  members={members}
                  ownerId={"ownerId"}
                  userId={"userId"}
                  dispatch={dispatch}
                  currentUserId={currentUserId}
                />
              </div>
            )}
          </div>

          {/* ── Items Dropdown ── */}
          <div className="mb-6">
            <button
              onClick={() => setItemsOpen(!itemsOpen)}
              className="w-full text-left px-4 py-2 bg-green-50 rounded-t-md font-medium text-green-700 hover:bg-green-100 transition flex justify-between items-center"
            >
              Položky ({items.length})<span>{itemsOpen ? "▲" : "▼"}</span>
            </button>
            {itemsOpen && (
              <div className="border border-t-0 border-gray-300 rounded-b-md p-4 bg-gray-50">
                <ItemList
                  items={items}
                  dispatch={{ type: "NOOP" }} // not used in create
                />
              </div>
            )}
          </div>

          {/* ── Actions ── */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Zrušit
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Vytvořit seznam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
