import { useTheme } from "../context/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-1 rounded-lg dark:bg-gray-200 bg-gray-700 hover:ring-2 ring-blue-400 transition-all"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};
