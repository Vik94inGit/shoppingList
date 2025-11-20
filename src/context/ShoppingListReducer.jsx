import { SHOPPING_LIST_DATA } from "../constants/initialData"
import { actionTypes } from "./ReducerHelper"

const save = (state) => {
  try {
    localStorage.setItem("shoppingLists", JSON.stringify(state.lists))
  } catch (err) {
    console.warn("[Reducer] Failed to save to localStorage", err)
  }
  return state
}

export const ShoppingListReducer = (state, action) => {
  let updatedLists

  switch (action.type) {
    // --- PŘEJMENOVÁNÍ SEZNAMU ---
    case actionTypes.renameList: {
      const { listId, newName } = action.payload || {}
      if (!listId || !newName) return state

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId ? { ...list, name: newName } : list
      )

      return save({ ...state, lists: updatedLists })
    }

    // --- PŘIDÁNÍ ČLENA ---
    case actionTypes.addMember: {
      const { listId, userId, userName, email } = action.payload
      if (!listId || !userId) return state

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId
          ? {
              ...list,
              members: [
                ...(Array.isArray(list.members) ? list.members : []),
                { userId, userName, email: email || "" },
              ],
            }
          : list
      )

      return save({ ...state, lists: updatedLists })
    }

    // --- ODEBRÁNÍ ČLENA ---
    case actionTypes.removeMember: {
      const { listId, memberId } = action.payload
      if (!listId || !memberId) return state

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId
          ? {
              ...list,
              members: list.members.filter((m) => m.userId !== memberId),
            }
          : list
      )

      return save({ ...state, lists: updatedLists })
    }

    // --- PŘIDÁNÍ POLOŽKY ---
    case actionTypes.addItem: {
      const { shopListId, userId, ...item } = action.payload
      if (!shopListId) return state

      const newItem = {
        ...item,
        isResolved: false,
      }

      updatedLists = state.lists.map((list) =>
        list.shopListId === shopListId
          ? { ...list, items: [...list.items, newItem] }
          : list
      )

      return save({ ...state, lists: updatedLists })
    }

    // --- TOGGLE POLOŽKY ---
    case actionTypes.toggleItemResolved: {
      const { listId, itemId } = action.payload
      if (!listId || !itemId) return state

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId
          ? {
              ...list,
              items: list.items.map((i) =>
                i.itemId === itemId ? { ...i, isResolved: !i.isResolved } : i
              ),
            }
          : list
      )

      return save({ ...state, lists: updatedLists })
    }

    case actionTypes.updateItem: {
      const { listId, itemId, itemName, count } = action.payload

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId
          ? {
              ...list,
              items: list.items.map((i) =>
                i.itemId === itemId ? { ...i, itemName, count } : i
              ),
            }
          : list
      )

      return save({ ...state, lists: updatedLists })
    }

    // --- ODEBRÁNÍ POLOŽKY ---
    case actionTypes.removeItem: {
      const { listId, itemId } = action.payload
      if (!listId || !itemId) return state

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId
          ? { ...list, items: list.items.filter((i) => i.itemId !== itemId) }
          : list
      )

      return save({ ...state, lists: updatedLists })
    }

    // --- RESET JEDNOHO SEZNAMU ---
    case actionTypes.resetList: {
      const listId = action.payload?.listId
      if (!listId) return state

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId
          ? { ...list, items: [], members: [{ userId: list.ownerId }] }
          : list
      )

      return save({ ...state, lists: updatedLists })
    }

    // --- ODEJÍT ZE SEZNAMU ---
    case actionTypes.leaveList: {
      const { listId, userId } = action.payload
      if (!listId || !userId) return state

      updatedLists = state.lists.map((list) =>
        list.shopListId === listId
          ? {
              ...list,
              members: list.members.filter((m) => m.userId !== userId),
            }
          : list
      )

      return save({ ...state, lists: updatedLists })
    }

    // --- SMAZÁNÍ SEZNAMU ---
    case actionTypes.deleteList: {
      const listId = action.payload?.listId
      console.log(listId)
      if (!listId) return state

      updatedLists = state.lists.filter((list) => list.shopListId !== listId)

      return save({ ...state, lists: updatedLists })
    }

    // --- NAČTENÍ SEZNAMŮ ---
    case actionTypes.loadLists: {
      const listsArray = Array.isArray(action.payload)
        ? action.payload
        : Object.values(action.payload || {})

      return save({ ...state, lists: listsArray, loading: false })
    }

    // --- RESET HOMEPAGE ---
    case actionTypes.resetHomePage: {
      return save({ ...state, lists: SHOPPING_LIST_DATA, loading: false })
    }

    // --- PŘIDÁNÍ NOVÉHO SEZNAMU ---
    case actionTypes.addList: {
      const newList = {
        shopListId: `sl-${Date.now()}`,
        ...action.payload,
        items: [],
        members: [{ userId: action.payload.ownerId }],
      }
      return save({ ...state, lists: [...state.lists, newList] })
    }

    case actionTypes.setLoading:
      return { ...state, loading: action.payload }

    default:
      return state
  }
}
