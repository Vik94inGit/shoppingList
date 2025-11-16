import { SHOPPING_LIST_DATA } from "../constants/initialData";

const save = (state) => {
  try {
    localStorage.setItem("shoppingLists", JSON.stringify(state.lists));
  } catch (err) {
    console.warn("[Reducer] Failed to save to localStorage", err);
  }
  return state;
};

export const ShoppingListReducer = (state, action) => {
  console.log("[Reducer] Action:", action.type, action.payload);

  let updatedLists;

  switch (action.type) {
    // --- PŘEJMENOVÁNÍ SEZNAMU ---
    case "RENAME_LIST": {
      const { listId, newName } = action.payload || {};
      if (!listId || !newName) return state;

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId || list.id === listId
          ? { ...list, name: newName }
          : list
      );

      return save({ ...state, lists: updatedLists });
    }

    // --- PŘIDÁNÍ ČLENA ---
    case "ADD_MEMBER": {
      const { listId, userId, userName, email } = action.payload;
      if (!listId || !userId) return state;

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId || list.id === listId
          ? {
              ...list,
              members: [
                ...(Array.isArray(list.members) ? list.members : []),
                { userId, userName, email: email || "" },
              ],
            }
          : list
      );

      return save({ ...state, lists: updatedLists });
    }

    // --- ODEBRÁNÍ ČLENA ---
    case "REMOVE_MEMBER": {
      const { listId, memberId } = action.payload;
      if (!listId || !memberId) return state;

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId || list.id === listId
          ? {
              ...list,
              members: list.members.filter((m) => m.userId !== memberId),
            }
          : list
      );

      return save({ ...state, lists: updatedLists });
    }

    // --- PŘIDÁNÍ POLOŽKY ---
    case "ADD_ITEM": {
      const { listId, itemName, count = 1 } = action.payload;
      if (!listId || !itemName) return state;

      const newItem = {
        id: `item-${Date.now()}`,
        itemName,
        count,
        isResolved: false,
      };

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId || list.id === listId
          ? { ...list, items: [...list.items, newItem] }
          : list
      );

      return save({ ...state, lists: updatedLists });
    }

    // --- TOGGLE POLOŽKY ---
    case "TOGGLE_ITEM_RESOLVED": {
      const { listId, itemId } = action.payload;
      if (!listId || !itemId) return state;

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId || list.id === listId
          ? {
              ...list,
              items: list.items.map((i) =>
                i.id === itemId ? { ...i, isResolved: !i.isResolved } : i
              ),
            }
          : list
      );

      return save({ ...state, lists: updatedLists });
    }

    // --- ODEBRÁNÍ POLOŽKY ---
    case "REMOVE_ITEM": {
      const { listId, itemId } = action.payload;
      if (!listId || !itemId) return state;

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId || list.id === listId
          ? { ...list, items: list.items.filter((i) => i.id !== itemId) }
          : śled
      );

      return save({ ...state, lists: updatedLists });
    }

    // --- RESET JEDNOHO SEZNAMU ---
    case "RESET_LIST": {
      const listId = action.payload?.listId;
      if (!listId) return state;

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId || list.id === listId
          ? { ...list, items: [], members: [{ userId: list.ownerId }] }
          : list
      );

      return save({ ...state, lists: updatedLists });
    }

    // --- ODEJÍT ZE SEZNAMU ---
    case "LEAVE_LIST": {
      const { listId, userId } = action.payload;
      if (!listId || !userId) return state;

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId || list.id === listId
          ? {
              ...list,
              members: list.members.filter((m) => m.userId !== userId),
            }
          : list
      );

      return save({ ...state, lists: updatedLists });
    }

    // --- SMAZÁNÍ SEZNAMU ---
    case "DELETE_LIST": {
      const listId = action.payload?.listId;
      if (!listId) return state;

      updatedLists = state.lists.filter(
        (list) => list.shopListId !== listId && list.id !== listId
      );

      return save({ ...state, lists: updatedLists });
    }

    // --- NAČTENÍ SEZNAMŮ ---
    case "LOAD_LISTS": {
      const listsArray = Array.isArray(action.payload)
        ? action.payload
        : Object.values(action.payload || {});

      return save({ ...state, lists: listsArray, loading: false });
    }

    // --- RESET HOMEPAGE ---
    case "RESET_HOMEPAGE": {
      return save({ ...state, lists: SHOPPING_LIST_DATA, loading: false });
    }

    // --- PŘIDÁNÍ NOVÉHO SEZNAMU ---
    case "ADD_LIST": {
      const newList = {
        shopListId: `sl-${Date.now()}`,
        ...action.payload,
        items: [],
        members: [{ userId: action.payload.ownerId }],
      };
      return save({ ...state, lists: [...state.lists, newList] });
    }

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};
