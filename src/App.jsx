import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ShoppingList } from "./components/shoppingList/ShoppingList.jsx";
import HomePage from "./components/homePage/HomePage.jsx";
import { LoginPage } from "./components/logPage/loginPage.jsx";
import { RegisterPage } from "./components/logPage/registerPage.jsx";

import { ShoppingListProvider } from "./context/ShoppingListContext.jsx";

// Helper component to protect routes
function PrivateRoute({ children }) {
  const token = sessionStorage.getItem("token");
  console.log("PrivateRoute token:", token);

  // If no token → send to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists → show the page
  return children;
}

export function App() {
  return (
    <ShoppingListProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/list/:shopListId"
            element={
              <PrivateRoute>
                <ShoppingList />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ShoppingListProvider>
  );
}
