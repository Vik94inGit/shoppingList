// src/components/ShoppingListCard.jsx
import { EditName } from "./EditName";
import { DeleteListButton } from "../shoppingList/DeleteListButton";

export default function ShoppingListCard({ list, isOwner, dispatch, onClick }) {
  const { shopListId, name, items } = list;

  // ← Remove ALL these broken lines:
  // const { shopListId, name, ownerId = [] } = list;
  // const { currentUser } = useShoppingList();
  // const currentUserId = currentUser?.id;
  // isOwner = ownerId === userId;  ← HUGE BUG!
  console.log(items.length, "items.length in ShoppingListCard");
  return (
    <div
      onClick={onClick}
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
    >
      {/* Shopping list name (main title) */}

      {/* Item count under the name */}
      <p className="text-gray-600 mb-4">
        {items.length} {items.length === 1 ? "item" : "items"}
      </p>
      <EditName
        name={name}
        shopListId={shopListId}
        dispatch={dispatch}
        isOwner={isOwner} // ← use the correct prop from HomePage!
      />
      {isOwner && (
        <div className="mt-4 flex justify-end">
          <DeleteListButton
            shopListId={shopListId} // ← pass the ID
            dispatch={dispatch}
          />
        </div>
      )}
    </div>
  );
}
