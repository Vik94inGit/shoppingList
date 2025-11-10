import { SHOPPING_LIST_DATA, CURRENT_USER_ID } from "../constants/initialData"; // src/context/shoppingListReducer.js

export const ShoppingListReducer = (state, action) => {
  // Pro autorizaci předpokládáme, že userId je v action.payload (nebo získáno z externího Contextu)
  const { ownerId, members } = state;
  const userId = action.payload?.userId ?? CURRENT_USER_ID; // fallback for old actions
  const isOwner = action.payload?.userId === ownerId;
  const isMember = members.some((m) => m.userId === action.payload?.userId);
  const isManager = isOwner || isMember;

  // Helper – apply change & persist to initialData
  const save = (state) => {
    try {
      localStorage.setItem("shoppingList", JSON.stringify(state));
    } catch (err) {
      console.error("Failed to save to localStorage:", err);
    }
    return state;
  };

  switch (action.type) {
    // --- LOGIKA SEZNAMU (Vlastník) ---
    case "RENAME_LIST":
      if (!isOwner) return state;
      return save({ ...state, name: action.payload.newName });

    case "UPDATE_ITEM":
      return save({
        ...state,
        items: state.items.map((item) =>
          item.itemId === action.payload.itemId
            ? { ...item, itemName: action.payload.itemName }
            : item
        ),
      });

    case "DELETE_LIST":
      if (!isOwner) return state;
      localStorage.removeItem("shoppingList");
      const empty = {
        shopListId: null,
        name: "Seznam smazán",
        ownerId: null,
        members: [],
        items: [],
      };
      return save(empty);

    // --- LOGIKA ČLENŮ (Owner / Member) ---
    case "ADD_MEMBER":
      if (!isOwner) return state;
      const newMember = {
        userId: `user-${Date.now()}`,
        userName: action.payload.userName,
        email: action.payload.email,
      };
      return save({ ...state, members: [...members, newMember] });

    case "REMOVE_MEMBER": {
      const memberIdToRemove = action.payload.memberId;
      const canRemove = isOwner || memberIdToRemove === userId;

      if (!canRemove || memberIdToRemove === ownerId) {
        console.warn(
          "Autorizace selhala: Nelze odstranit Vlastníka nebo nemáte oprávnění."
        );
        return state;
      }
      return save({
        ...state,
        members: members.filter((m) => m.userId !== memberIdToRemove),
      });
    }

    // --- LOGIKA POLOŽEK (Owner / Member) ---
    case "ADD_ITEM":
      if (!isManager) return state;
      const newItem = {
        itemId: Date.now().toString(),
        itemName: action.payload.itemName,
        count: action.payload.count || 1,
        isResolved: false,
      };
      return save({ ...state, items: [...state.items, newItem] });

    case "RESET_LIST": {
      // Replace the whole list with the original data
      return { ...SHOPPING_LIST_DATA };
    }

    case "TOGGLE_ITEM_RESOLVED":
      if (!isManager) return state;
      return save({
        ...state,
        items: state.items.map((item) =>
          item.itemId === action.payload.itemId
            ? { ...item, isResolved: !item.isResolved }
            : item
        ),
      });

    case "REMOVE_ITEM":
      if (!isManager) return state;
      return save({
        ...state,
        items: state.items.filter(
          (item) => item.itemId !== action.payload.itemId
        ),
      });

    default:
      return state;
  }
};
