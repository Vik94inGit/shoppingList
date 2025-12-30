import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const isDark = theme === "dark";

  return (
    <div className="w-full px-2">
      <button
        onClick={toggleTheme}
        className={`
          relative w-full flex items-center justify-between p-1 rounded-2xl transition-all duration-300
          ${isDark ? "bg-gray-700 shadow-inner" : "bg-blue-100 shadow-inner"}
        `}
      >
        {/* Textové popisky */}
        <span
          className={`flex-1 text-center text-sm font-bold transition-opacity ${
            !isDark ? "text-blue-600" : "text-gray-400 opacity-50"
          }`}
        >
          {t("common.light") || "Light"}
        </span>
        <span
          className={`flex-1 text-center text-sm font-bold transition-opacity ${
            isDark ? "text-white" : "text-gray-400 opacity-50"
          }`}
        >
          {t("common.dark") || "Dark"}
        </span>

        {/* Pohyblivý jezdec (Kolečko) */}
        <div
          className={`
            absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl
            flex items-center justify-center text-lg shadow-md transition-all duration-300 transform
            ${
              isDark
                ? "translate-x-[calc(100%+0px)] bg-gray-800 border border-gray-600"
                : "translate-x-0 bg-white border border-blue-200"
            }
          `}
        >
          {isDark ? "🌙" : "☀️"}
        </div>
      </button>

      {/* Volitelný popisek pod přepínačem pro lepší UX v menu */}
      <p className="text-center text-[10px] mt-2 text-gray-400 uppercase tracking-widest font-bold">
        {isDark ? t("common.dark") : t("common.light")}
      </p>
    </div>
  );
};
