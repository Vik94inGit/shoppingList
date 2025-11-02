// src/context/ShoppingListContext.js

import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { ShoppingListReducer } from "./ShoppingListReducer";
import { SHOPPING_LIST_DATA, CURRENT_USER_ID } from "../constants/initialData";

const ShoppingListContext = createContext();

const loadInitialState = () => {
  try {
    const saved = localStorage.getItem("shoppingList");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
  } catch (err) {
    console.warn(
      "[Context] Corrupted or invalid localStorage → resetting",
      err
    );
    localStorage.removeItem("shoppingList");
  }

  return SHOPPING_LIST_DATA;
};

export const ShoppingListProvider = ({ children }) => {
  const [listData, rawDispatch] = useReducer(
    ShoppingListReducer,
    loadInitialState()
  );

  // V Reduceru potřebujeme CURRENT_USER_ID.
  // Pro zjednodušení ho přidáme do dispatch akce. V reálu by byl Context pro Uživ.
  const dispatch = useCallback(
    (action) => {
      const payload = { ...(action.payload || {}), userId: CURRENT_USER_ID };
      rawDispatch({ ...action, payload });
    },
    [rawDispatch]
  );

  const contextValue = useMemo(
    () => ({ listData, dispatch, userId: CURRENT_USER_ID }),
    [listData, dispatch]
  );
  return (
    <ShoppingListContext.Provider value={contextValue}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => useContext(ShoppingListContext);
