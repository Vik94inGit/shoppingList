import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.jsx";
import { ChangeLanguage } from "./components/ChangeLanguage.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ThemeToggle } from "./components/ThemeToggle.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-slate-900 text-black dark:text-white">
        <ThemeToggle />
        <ChangeLanguage />
        <App />
      </div>
    </ThemeProvider>
  </StrictMode>
);
