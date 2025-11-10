import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShoppingListApp from "./routes/ShoppingListApp.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: "30px", fontFamily: "Inter, sans-serif" }}>
              <h1 style={{ color: "#101316ff" }}>Vítejte v Nákupním Seznamu</h1>
              <p>
                Aplikace očekává dynamické ID seznamu. Pro spuštění přejděte na
                URL s ID seznamu, např.:
              </p>
              <p>
                <a
                  href="/list/sl-1"
                  style={{ color: "#15331cff", fontWeight: "bold" }}
                >
                  /list/sl-1
                </a>
              </p>
            </div>
          }
        />
        <Route path="/list/sl-1" element={<ShoppingListApp />} />
        {/* /list/sl-1 by spustil naši komponentu */}
      </Routes>
      ~
    </Router>
  );
}
