import React from "react";
import { ShoppingList } from "../components/ShoppingList";
import { ShoppingListProvider } from "../context/shoppingListContext";

// V reálné aplikaci by tato komponenta obalila celou aplikaci.
export default function ShoppingListApp() {
  return (
    <ShoppingListProvider>
      <ShoppingList />
    </ShoppingListProvider>
  );
}
