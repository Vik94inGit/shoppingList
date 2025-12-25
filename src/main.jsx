import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.jsx";
import { ChangeLanguage } from "./components/ChangeLanguage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChangeLanguage />
    <App />
  </StrictMode>
);
