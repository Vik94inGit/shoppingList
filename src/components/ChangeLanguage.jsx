import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "cz", label: "Čeština", flag: "🇨🇿" },
];

export const ChangeLanguage = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`
            flex items-center justify-between px-4 py-3 rounded-xl transition-all
            ${
              i18n.language === lang.code
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            }
          `}
        >
          <span className="font-medium">{lang.label}</span>
          <span className="text-lg">{lang.flag}</span>
        </button>
      ))}
    </div>
  );
};
