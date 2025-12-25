// src/context/ShoppingListContext.jsx

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ShoppingListReducer } from "./ShoppingListReducer.jsx";
import { actionTypes } from "./ReducerHelper";

import {
  fetchAllLists,
  createList,
  deleteList,
  updateList,
} from "../components/homePage/useHomePage.js";
import {
  addItemToList,
  addMemberToList,
  deleteMember,
} from "../components/shoppingList/useShoppingList.js";

const ShoppingListContext = createContext();

const initialState = {
  lists: [],
  loading: true,
  error: null,
};

export function ShoppingListProvider({ children }) {
  const [state, dispatch] = useReducer(ShoppingListReducer, initialState);

  const { lists, loading, error } = state;
  const [currentUser, setCurrentUser] = useState(null);

  // Decode user from JWT token (or get from sessionStorage if you saved it)
  // In ShoppingListProvider

  const loadUserData = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      dispatch({ type: actionTypes.setLoading, payload: true });

      // Decode user (as you did before)
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUser({
        id: payload.id,
        userName: payload.userName,
        email: payload.email,
      });

      const lists = await fetchAllLists();
      dispatch({ type: actionTypes.loadLists, payload: lists });
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      dispatch({ type: actionTypes.setLoading, payload: false });
    }
  };

  // 2. Initial load (for page refresh)
  useEffect(() => {
    loadUserData();
  }, []);
  const logout = () => {
    sessionStorage.removeItem("token");
    setCurrentUser(null);
    dispatch({ type: actionTypes.loadLists, payload: [] });
    dispatch({ type: actionTypes.setLoading, payload: false });
  };

  const login = async (token) => {
    sessionStorage.setItem("token", token);
    // CRITICAL: Call the load function immediately after setting the token
    await loadUserData();
  };

  // === Async action helpers (thunks) ===
  const createNewList = async (listData) => {
    console.log("Creating new list with data:", listData);
    try {
      const newList = await createList(listData);
      // Assuming API returns { success: true, data: { ...list } }
      const listToAdd = newList.data || newList;
      dispatch({ type: actionTypes.addList, payload: listToAdd });
    } catch (err) {
      console.error("Create list failed:", err);
      throw err; // let component handle error
    }
  };

  const updateById = async (shopListId, updateData) => {
    try {
      const updatedList = await updateList(shopListId, updateData);
      dispatch({ type: actionTypes.renameList, payload: updatedList });
    } catch (err) {
      console.error("Update failed:", err);
      throw err;
    }
  };

  const deleteListById = async (shopListId) => {
    try {
      await deleteList(shopListId);
      dispatch({ type: actionTypes.deleteList, payload: { shopListId } });
    } catch (err) {
      console.error("Delete failed:", err);
      throw err;
    }
  };

  // You can add more: updateListName, addItem, etc. with API calls + dispatch
  console.log("DEBUG: Context State Update", {
    currentUser: currentUser?.userName,
    listsCount: lists?.length,
    loadingState: loading,
  });

  const inviteMemberToList = async (shopListId, userData) => {
    try {
      console.log("Inviting member", userData, "to list", shopListId);
      await addMemberToList(shopListId, userData);
      // Update the local state so the UI refreshes immediately
      dispatch({ type: actionTypes.addMember, payload: userData });
    } catch (err) {
      console.error("Failed to add member", err);
    }
  };

  // Example: Remove a member
  const removeMember = async (shopListId, memberId) => {
    try {
      await deleteMember(shopListId, memberId);
      dispatch({
        type: actionTypes.removeMember,
        payload: { shopListId, memberId },
      });
    } catch (err) {
      console.error("Failed to remove member", err);
    }
  };

  const addItem = async (shopListId, itemData) => {
    try {
      // Optimistic update: add temporarily to UI (optional, see note below)
      // But safer: wait for server response

      const newItemFromServer = await addItemToList(shopListId, {
        itemName: itemData.itemName,
        count: itemData.count ? Number(itemData.count) : 1,
        isResolved: false,
      });

      // The backend should return the created item with its server-generated ID
      // e.g. { itemId: "123", itemName: "Milk", count: 2, ... }

      dispatch({
        type: actionTypes.addItem,
        payload: {
          shopListId,
          ...newItemFromServer, // spread the full item (includes itemId)
          itemId: newItemFromServer.itemId || newItemFromServer._id,
        },
      });
    } catch (err) {
      console.error("Failed to add item:", err);
      // Optionally dispatch an error action or show toast
      throw err;
    }
  };

  const value = useMemo(
    () => ({
      lists,
      loading,
      error,
      currentUser,
      login,
      logout,
      dispatch,
      actions: {
        createNewList,
        deleteListById,
        updateById,
        addItem,
        inviteMemberToList,
        removeMember,
      },
    }),
    [
      lists,
      loading,
      error,
      currentUser,
      createNewList,
      deleteListById,
      updateById,
      inviteMemberToList,
      addItem,
      removeMember,
      addMemberToList,
    ]
  );

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error("useShoppingList must be used within ShoppingListProvider");
  }
  return context;
};
