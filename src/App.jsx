import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ShoppingList } from "./components/ShoppingList.jsx";
import HomePage from "./components/homePage/homePage.jsx";
import { ShoppingListProvider } from "./context/ShoppingListContext.jsx";

export function App() {
  return (
    <ShoppingListProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/list/:listId" element={<ShoppingList />} />
        </Routes>
      </Router>
    </ShoppingListProvider>
  );
}
