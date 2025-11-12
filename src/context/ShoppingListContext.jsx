import { createContext, useContext, useReducer, useEffect } from "react";
import {
  CURRENT_USER_ID,
  SHOPPING_LIST_DATA,
} from "../constants/initialData.js";
import { ShoppingListReducer } from "./ShoppingListReducer.jsx";

const ShoppingListContext = createContext();
export const loadInitialState = () => {
  let listData = { ...SHOPPING_LIST_DATA };
  try {
    const saved = localStorage.getItem("shoppingList");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Only merge if it looks like a valid list
      if (parsed && typeof parsed === "object" && parsed.shopListId) {
        listData = parsed;
      }
    }
  } catch (err) {
    console.warn("[Context] Corrupted localStorage → resetting", err);
    localStorage.removeItem("shoppingList");
  }

  return listData;
};

export function ShoppingListProvider({ children }) {
  const [listData, dispatch] = useReducer(
    ShoppingListReducer,
    loadInitialState()
  );

  // Save to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem("shoppingList", JSON.stringify(listData));
    } catch (err) {
      console.error("[Context] Save failed", err);
    }
  }, [listData]);

  const value = {
    listData, // ← { name, items, members, ... }
    userId: CURRENT_USER_ID, // ← for auth, never in localStorage
    dispatch,
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
}

// Export the hook
export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error("useShoppingList must be used within ShoppingListProvider");
  }
  return context;
};
