import React from "react";
import { ShoppingList } from "../components/shoppingList";
import { ShoppingListProvider } from "../context/ShoppingListContext";

// V reálné aplikaci by tato komponenta obalila celou aplikaci.
export default function ShoppingListApp() {
  return (
    <ShoppingListProvider>
      <ShoppingList />
    </ShoppingListProvider>
  );
}
