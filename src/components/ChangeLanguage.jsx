import { useState } from "react";
import { useTranslation } from "react-i18next";

export const ChangeLanguage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    i18n: { language, changeLanguage },
  } = useTranslation();

  const onChangeLanguage = (lng) => {
    changeLanguage(lng);
    setIsMenuOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsMenuOpen((p) => !p)}
        className="fixed top-5 right-14"
      >
        {language}
      </button>
      {isMenuOpen && (
        <div className="fixed right-12 top-12 bg-white border  rounded-lg shadow-md min-w-[120px] z-50">
          <>
            <button
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => onChangeLanguage("en")}
            >
              en
            </button>
            <button
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              onClick={() => onChangeLanguage("cz")}
            >
              cz
            </button>
          </>
        </div>
      )}
    </>
  );
};
