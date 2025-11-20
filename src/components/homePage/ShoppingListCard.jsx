// src/components/ShoppingListCard.jsx
import { EditName } from "../shoppingList/EditName"
import { DeleteListButton } from "../shoppingList/DeleteListButton"
export default function ShoppingListCard({ list, isOwner, dispatch, onClick }) {
  const { shopListId, name, ownerId = [] } = list

  return (
    <div
      onClick={onClick}
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* List Name */}
      <EditName name={name} shopListId={shopListId} dispatch={dispatch} />

      {/* Action Buttons */}
      {isOwner && (
        <div className="flex gap-2 mt-4">
          <DeleteListButton
            userId={list.currentUserId}
            ownerId={ownerId}
            dispatch={dispatch}
          />
        </div>
      )}

      {/* Optional: Link to list details */}
      {/* <Link to={`/list/${id}`} className="block mt-3 text-blue-600 text-sm">
        Open list →
      </Link> */}
    </div>
  )
}
