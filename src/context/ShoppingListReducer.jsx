import { SHOPPING_LIST_DATA } from "../constants/initialData";
import { actionTypes } from "./ReducerHelper";

export const ShoppingListReducer = (state, action) => {
  let updatedLists;

  switch (action.type) {
    // --- PŘEJMENOVÁNÍ SEZNAMU ---

    // --- PŘIDÁNÍ ČLENA ---
    case actionTypes.addMember: {
      const { shopListId, memberId, userName, email } = action.payload;
      if (!shopListId || !memberId) return state;

      updatedLists = state.lists.map((list) =>
        list.shopListId === shopListId
          ? {
              ...list,
              members: [
                ...(Array.isArray(list.members) ? list.members : []),
                { memberId, userName, email: email || "" },
              ],
            }
          : list
      );

      return { ...state, lists: updatedLists };
    }

    case actionTypes.updateMemberName:
      return {
        ...state,
        // Projdeme všechny seznamy
        lists: state.lists.map((list) => {
          // Najdeme ten, který chceme upravit
          if (list.shopListId === action.payload.shopListId) {
            return {
              ...list,
              // V tomto seznamu projdeme členy a upravíme jméno tomu správnému
              members: list.members.map((member) =>
                member.memberId === action.payload.memberId
                  ? { ...member, userName: action.payload.newName }
                  : member
              ),
            };
          }
          return list;
        }),
      };

    // --- ODEBRÁNÍ ČLENA ---
    case actionTypes.removeMember: {
      const { shopListId, memberId } = action.payload;
      if (!shopListId || !memberId) return state;

      updatedLists = state.lists.map((list) =>
        list.shopListId === shopListId
          ? {
              ...list,
              members: list.members.filter((m) => m.memberId !== memberId),
            }
          : list
      );

      return { ...state, lists: updatedLists };
    }

    case actionTypes.leaveList: {
      const { shopListId, memberId } = action.payload;

      const updatedLists = state.lists.map((list) =>
        list.shopListId === shopListId
          ? {
              ...list,
              members: list.members.filter((m) => m.memberId !== memberId),
            }
          : list
      );

      return { ...state, lists: updatedLists };
    }

    // --- PŘIDÁNÍ POLOŽKY ---
    case actionTypes.addItem: {
      const { shopListId, ...item } = action.payload; // item now has itemId!
      if (!shopListId) return state;

      return {
        ...state,
        lists: state.lists.map((list) =>
          list.shopListId === shopListId
            ? { ...list, items: [...list.items, item] }
            : list
        ),
      };
    }

    // --- TOGGLE POLOŽKY ---
    case actionTypes.toggleItemResolved: {
      const { shopListId, itemId } = action.payload;
      if (!shopListId || !itemId) return state;

      updatedLists = state.lists.map((list) =>
        list.shopListId === shopListId
          ? {
              ...list,
              items: list.items.map((i) =>
                i.itemId === itemId ? { ...i, isResolved: !i.isResolved } : i
              ),
            }
          : list
      );

      return { ...state, lists: updatedLists };
    }

    case actionTypes.updateItem: {
      const { shopListId, itemId, itemName, count } = action.payload;

      updatedLists = state.lists.map((list) =>
        list.shopListId === shopListId
          ? {
              ...list,
              items: list.items.map((i) =>
                i.itemId === itemId ? { ...i, itemName, count } : i
              ),
            }
          : list
      );

      return { ...state, lists: updatedLists };
    }

    // --- ODEBRÁNÍ POLOŽKY ---
    case actionTypes.removeItem: {
      const { shopListId, itemId } = action.payload;
      if (!shopListId || !itemId) return state;

      updatedLists = state.lists.map((list) =>
        list.shopListId === shopListId
          ? { ...list, items: list.items.filter((i) => i.itemId !== itemId) }
          : list
      );

      return { ...state, lists: updatedLists };
    }

    // --- RESET JEDNOHO SEZNAMU ---
    // shoppingListReducer.js
    case actionTypes.resetHomePage:
      return {
        ...state,
        lists: [], // Toto okamžitě vymaže UI
        loading: false,
      };

    // --- ODEJÍT ZE SEZNAMU ---
    case actionTypes.leaveList: {
      const { shopListId, memberId } = action.payload;
      if (!shopListId || !memberId) return state;

      updatedLists = state.lists.map((list) =>
        list.shopListId === shopListId
          ? {
              ...list,
              members: list.members.filter((m) => m.memberId !== memberId),
            }
          : list
      );

      return { ...state, lists: updatedLists };
    }

    // --- SMAZÁNÍ SEZNAMU ---
    case actionTypes.deleteList: {
      const shopListId = action.payload?.shopListId;
      console.log(shopListId);
      if (!shopListId) return state;

      updatedLists = state.lists.filter(
        (list) => list.shopListId !== shopListId
      );

      return { ...state, lists: updatedLists };
    }

    // --- NAČTENÍ SEZNAMŮ ---
    case actionTypes.loadLists: {
      const listsArray = Array.isArray(action.payload)
        ? action.payload
        : Object.values(action.payload || {});

      return { ...state, lists: listsArray, loading: false };
    }

    // --- RESET HOMEPAGE ---

    // --- PŘIDÁNÍ NOVÉHO SEZNAMU ---
    case actionTypes.addList: {
      const newList = {
        ...action.payload,
        items: [],
        members: [{ memberId: action.payload.ownerId }],
      };
      return { ...state, lists: [...state.lists, newList] };
    }

    case actionTypes.updateListSuccess:
      return {
        ...state,
        lists: state.lists.map((l) =>
          l.shopListId === action.payload.shopListId ? action.payload : l
        ),
      };

    case actionTypes.setLoading:
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};
