import { createContext, useContext, useReducer, useEffect } from "react";
import {
  CURRENT_USER_ID,
  SHOPPING_LIST_DATA,
} from "../constants/initialData.js";
import { ShoppingListReducer } from "./ShoppingListReducer.jsx";

const ShoppingListContext = createContext();

const loadInitialState = () => {
  try {
    const saved = localStorage.getItem("shoppingList");
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.warn("[Context] Corrupted localStorage → resetting", err);
    localStorage.removeItem("shoppingList");
  }
  return SHOPPING_LIST_DATA;
};

export function ShoppingListProvider({ children }) {
  const [listData, rawDispatch] = useReducer(
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

  const dispatch = (action) => rawDispatch(action);

  return (
    <ShoppingListContext.Provider value={{ listData, dispatch }}>
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
