import { useState } from "react";
import { updateMember } from "./useShoppingList";
import { actionTypes } from "../../context/ReducerHelper";

export function EditMember({ member, shopListId, dispatch, onClose }) {
  const [newName, setNewName] = useState(member.userName);
  const memberId = member.memberId;

  console.log(member, shopListId, "member, shopListId,");
  const cleanShopListId =
    typeof shopListId === "object" ? shopListId.shopListId : shopListId;

  const handleSave = async () => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === member.userName) {
      onClose();
      return;
    }

    const updatedData = {
      userName: trimmed,
      email: member.email,
    };

    console.log(
      "for updateMember cleanShopListId, member.memberId, updatedData",
      cleanShopListId,
      member.memberId,
      updatedData
    );
    try {
      // THE FIX: Ensure arguments are in the right order
      // (listId, memberId, data)
      await updateMember(cleanShopListId, memberId, updatedData);

      dispatch({
        type: actionTypes.updateMemberName,
        payload: {
          shopListId: cleanShopListId,
          memberId: member.memberId,
          newName: trimmed,
        },
      });
      onClose();
    } catch (error) {
      console.error("Failed to update:", error);
      // Optional: Add user-facing error message here
    }
  };

  return (
    <div className="flex items-center gap-2 animate-in fade-in duration-200">
      <input
        autoFocus
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        onBlur={handleSave} // Uloží při kliknutí vedle
        className="px-2 py-1 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
