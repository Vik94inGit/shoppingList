import { useState, useMemo, useCallback, useEffect } from "react";
import { useShoppingList } from "../../context/ShoppingListContext";
import ShoppingListCard from "./ShoppingListCard";
import CreateListModal from "./CreateList";
import { useNavigate } from "react-router-dom";
import { actionTypes } from "../../context/ReducerHelper";
import { LogoutButton } from "../logPage/logOut";

export default function HomePage() {
  // ── UI state ─────────────────────────────────────────────────────
  const [filter, setFilter] = useState("all"); // "all" | "owned" | "shared"
  const [modalOpen, setModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // ── Global state ─────────────────────────────────────────────────
  const {
    lists,
    loading,
    currentUser, // ← renamed from currentUserId
    dispatch,
    actions, // ← new: createNewList, deleteListById, etc.
  } = useShoppingList();
  const navigate = useNavigate(); // ← for navigation
  // ── Filtered lists (memoised) ───────────────────────────────────

  console.log(currentUser, "currentUser in HomePage");

  console.log(
    "lists in HomePage:",
    lists,
    "currentUser in HomePage:",
    currentUser
  );
  const currentUserId = currentUser?.id;

  const filteredLists = useMemo(() => {
    if (!currentUserId || !Array.isArray(lists)) return [];

    const accessibleLists = lists.filter((list) => {
      // Owner always has access
      if (list.ownerId === currentUserId) return true;

      // Or is a member
      if (Array.isArray(list.members)) {
        return list.members.some((m) => m.memberId === currentUserId); // ← fix: use m.userId, not m.memberId
      }

      return false;
    });

    // STEP 2: Now apply the filter on top of accessible lists only
    if (filter === "owned") {
      return accessibleLists.filter((l) => l.ownerId === currentUserId);
    }

    if (filter === "shared") {
      return accessibleLists.filter((l) =>
        Array.isArray(l.members)
          ? l.members.some(
              (m) => m.memberId === currentUserId && m.memberId !== l.ownerId
            )
          : false
      );
    }

    // "all" → show all accessible (owned + shared)
    return accessibleLists;
  }, [lists, currentUserId, filter]);

  const handleCardClick = useCallback(
    (shopListId) => {
      navigate(`/list/${shopListId}`);
    },
    [navigate]
  );

  // ── Reset handler ───────────────────────────────────────────────
  const resetListToDefault = useCallback(() => {
    if (!window.confirm("Wanna reset data in homePage?")) return;
    dispatch({ type: actionTypes.resetHomePage });
  }, [dispatch]);

  if (!currentUser && loading) {
    return <div>Loading user session...</div>;
  }

  // 2. Guard against missing user after loading finishes
  if (!currentUser) {
    return <div>Please log in to view your lists.</div>;
  }

  // ── Render ───────────────────────────────────────────────────────
  if (loading) return <p className="p-4 text-center">Loading…</p>;
  else {
    return (
      <div className="p-4 max-w-5xl mx-auto margin-top-8-left-30">
        {/* ── Header + Pop-over filters ── */}
        <header className="flex justify-between items-center mb-6 relative">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-gray-900 dark:text-white">
            Shopping Lists
          </h1>
          <div className="w-9"></div>
          <div className="flex items-center gap-3">
            <LogoutButton className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition" />

            <button
              onClick={() => setIsPopoverOpen((p) => !p)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition text-lg font-medium"
            >
              ⋯
            </button>
          </div>

          {/* Pop-over */}
          {isPopoverOpen && (
            <div className="absolute right-0 top-10 bg-white shadow-lg rounded p-2 flex gap-2 z-10">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded ${
                  filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("owned")}
                className={`px-3 py-1 rounded ${
                  filter === "owned" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                My Lists
              </button>
              <button
                onClick={() => setFilter("shared")}
                className={`px-3 py-1 rounded ${
                  filter === "shared" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Shared with Me
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                New List
              </button>
              <button
                onClick={resetListToDefault}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Reset
              </button>
            </div>
          )}
        </header>

        {/* ── List of cards ── */}
        <section className="mt-11 grid gap-0 md:grid-cols-2 lg:grid-cols-3">
          {filteredLists.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              {filter === "all"
                ? "No lists yet."
                : filter === "owned"
                ? "You haven't created any lists."
                : "No one has shared a list with you yet."}
              {filter === "shared" && "No lists shared with you yet."}
            </p>
          ) : (
            filteredLists.map((list) => {
              const isOwner = list.ownerId === currentUserId;
              const isMember =
                !isOwner &&
                Array.isArray(list.members) &&
                list.members.some((m) => m.memberId === currentUserId);
              return (
                <ShoppingListCard
                  key={list.shopListId}
                  list={list}
                  isOwner={isOwner}
                  isMember={isMember}
                  dispatch={dispatch}
                  onClick={() => handleCardClick(list.shopListId)}
                />
              );
            })
          )}
        </section>

        {/* ── Create List Modal ── */}
        <CreateListModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    );
  }
}
