import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import {
  CURRENT_USER_ID,
  SHOPPING_LIST_DATA,
  initialState,
} from "../constants/initialData.js";
import { ShoppingListReducer } from "./ShoppingListReducer.jsx";
import { getListAuth } from "./ReducerHelper";
const ShoppingListContext = createContext();

export function ShoppingListProvider({ children }) {
  const [state, dispatch] = useReducer(ShoppingListReducer, initialState);
  const [currentUserId, setCurrentUserId] = useState(CURRENT_USER_ID);

  // Save to localStorage on every change
  useEffect(() => {
    const load = async () => {
      try {
        const saved = localStorage.getItem("shoppingLists");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            dispatch({ type: "LOAD_LISTS", payload: parsed });
          }
        } else {
          // No saved data → use mock data
          dispatch({ type: "LOAD_LISTS", payload: SHOPPING_LIST_DATA });
        }
      } catch (err) {
        console.warn("[Context] Load failed", err);
        // Fallback to mock data
        dispatch({ type: "LOAD_LISTS", payload: SHOPPING_LIST_DATA });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false }); // ← CRITICAL
      }
    };
    load();
  }, [dispatch]);

  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem("shoppingLists", JSON.stringify(state.lists));
    }
  }, [state.lists, state.loading]);

  // === 3. Helper to get auth for any list ===
  const getListAuthFor = (listId) =>
    getListAuth(state.lists, listId, currentUserId);

  // === 4. Login / Switch User (for demo) ===
  const loginAs = (userId) => {
    setCurrentUserId(userId);
    localStorage.setItem("currentUserId", userId);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUserId");
    if (savedUser) setCurrentUserId(savedUser);
  }, []);
  1;
  const value = {
    state: {
      lists: state.lists,
      loading: state.loading,
    },
    currentUserId,
    dispatch,
    getListAuth: getListAuthFor,
    loginAs,
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
