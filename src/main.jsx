import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <div className="flex flex-col min-h-dvh transition-colors duration-300 bg-white dark:bg-slate-900 text-black dark:text-white pb-20">
        <App />
      </div>
    </ThemeProvider>
  </StrictMode>
);
