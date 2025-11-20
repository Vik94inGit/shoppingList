import { useState, useMemo, useCallback } from "react"
import { useShoppingList } from "../../context/ShoppingListContext"
import ShoppingListCard from "./ShoppingListCard"
import CreateListModal from "./CreateList"
import { useNavigate } from "react-router-dom"
import { actionTypes } from "../../context/ReducerHelper"

export default function HomePage() {
  // ── UI state ─────────────────────────────────────────────────────
  const [filter, setFilter] = useState("all") // "all" | "owned" | "shared"
  const [modalOpen, setModalOpen] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  // ── Global state ─────────────────────────────────────────────────
  const { state, currentUserId, dispatch } = useShoppingList()
  const { lists, loading } = state
  const navigate = useNavigate() // ← for navigation
  // ── Filtered lists (memoised) ───────────────────────────────────
  console.log(state)

  const filteredLists = useMemo(() => {
    if (!currentUserId || !Array.isArray(lists)) return []

    if (filter === "owned") {
      return lists.filter((l) => l.ownerId === currentUserId)
    }

    if (filter === "shared") {
      return lists.filter((l) =>
        Array.isArray(l.members)
          ? l.members.some(
              (m) => m.userId === currentUserId && m.userId !== l.ownerId
            )
          : false
      )
    }

    return lists // "all"
  }, [lists, currentUserId, filter])

  // ── Permission helper (owner / member) ───────────────────────────
  const getPermissions = useCallback(
    (list) => {
      const isOwner = list.ownerId === currentUserId
      const isMember = Array.isArray(list.members)
        ? list.members.some((m) => m.userId === currentUserId)
        : false

      const isManager = isOwner || isMember

      // Optional: pass full member object
      const currentMember = list.members.find((m) => m.userId === currentUserId)
      return { isOwner, isMember, isManager, currentMember }
    },
    [currentUserId]
  )

  const handleCardClick = useCallback(
    (listId) => {
      navigate(`/list/${listId}`)
    },
    [navigate]
  )

  // ── Reset handler ───────────────────────────────────────────────
  const resetListToDefault = useCallback(() => {
    if (!window.confirm("Wanna reset data in homePage?")) return
    dispatch({ type: actionTypes.resetHomePage })
  }, [dispatch])

  // ── Render ───────────────────────────────────────────────────────
  if (loading) return <p className="p-4 text-center">Loading…</p>
  else {
    return (
      <div className="p-4">
        {/* ── Header + Pop-over filters ── */}
        <header className="flex justify-between items-center mb-6 relative">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Lists</h1>

          <button
            onClick={() => setIsPopoverOpen((p) => !p)}
            className="border rounded-full w-9 h-9 flex items-center justify-center"
          >
            •••
          </button>

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
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLists.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              {filter === "all"
                ? "No lists yet."
                : filter === "owned"
                ? "You haven't created any lists."
                : "No one has shared a list with you yet."}
            </p>
          ) : (
            filteredLists.map((list) => {
              const { isOwner, isManager } = getPermissions(list)
              return (
                <ShoppingListCard
                  key={list.shopListId}
                  list={list}
                  isOwner={isOwner}
                  dispatch={dispatch}
                  onClick={() => handleCardClick(list.shopListId)}
                />
              )
            })
          )}
        </section>

        {/* ── Create List Modal ── */}
        <CreateListModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    )
  }
}
