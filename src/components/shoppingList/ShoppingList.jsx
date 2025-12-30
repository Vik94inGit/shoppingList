// src/pages/ShoppingList.jsx (or wherever it is)
import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // ← use Link instead of <a href>
import { useShoppingList } from "../../context/ShoppingListContext";
import { EditName } from "../homePage/EditName";
import { DeleteListButton } from "./DeleteListButton.jsx";
import { MemberList } from "./MemberList";
import ItemList from "./ItemList";
import { CreateItem } from "./CreateItem";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "../ThemeToggle.jsx";
import { ChangeLanguage } from "../ChangeLanguage.jsx";
import { ListDetailChart } from "../listChart.jsx";

const FilterOptions = ["All", "Unsolved", "Solved"];

export function ShoppingList() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isMembersListVisible, setIsMembersListVisible] = useState(false);
  const [isChartVisible, setIsChartVisible] = useState(false); // Stav pro modal s grafem
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const { t } = useTranslation();
  const { shopListId } = useParams();
  const { lists, currentUser, dispatch } = useShoppingList();
  const currentUserId = currentUser?.id;
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsPopoverOpen(false);
        setActiveSubmenu(null);
      }
    };
    if (isPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPopoverOpen]);

  const list = lists.find((l) => l.shopListId === shopListId);

  if (!list) {
    return (
      <p className="p-4 text-red-600 text-center dark:text-red-400 text-xl">
        {t("pages.shoppingList.notFound")}
      </p>
    );
  }

  console.log("list in shopList", list);

  const completedCount = list.items.filter((item) => item.isResolved).length;
  const pendingCount = list.items.length - completedCount;

  const dataForChart = [
    { name: "Hotovo", value: completedCount, color: "#4caf50" }, // Zelená
    { name: "Zbývá", value: pendingCount, color: "#ff9800" }, // Oranžová
  ];

  const { name, ownerId, members = [], items = [] } = list;

  console.log(
    "shoppingList details name, ownerId, members",
    name,
    ownerId,
    members,
    items
  );

  const isOwner = ownerId === currentUserId;
  const isMember = members.some((m) => m.memberId === currentUserId);
  const isManager = isOwner || isMember;

  const filteredItems = items.filter((item) => {
    if (activeFilter === "Solved") return item.isResolved;
    if (activeFilter === "Unsolved") return !item.isResolved;
    return true;
  });

  const toggleMembers = () => setIsMembersListVisible((prev) => !prev);

  const resetListToDefault = () => {
    if (window.confirm(t("pages.shoppingList.confirmReset"))) {
      dispatch({ type: "resetList", payload: { shopListId } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Horní lišta: Zpět + Menu */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            ← {t("pages.shoppingList.backToHome")}
          </Link>

          {/* Menu tlačítko (...) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => {
                setIsPopoverOpen(!isPopoverOpen);
                setActiveSubmenu(null);
              }}
              className="w-10 h-10 rounded-full border dark:border-gray-600 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-sm text-xl text-gray-600 dark:text-gray-300"
              aria-label="Menu"
            >
              ⋯
            </button>

            {/* Popover menu */}
            {isPopoverOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                {/* Submenu (zpět) */}
                {activeSubmenu && (
                  <div className="p-4 animate-in slide-in-from-right-2 duration-200">
                    <button
                      onClick={() => setActiveSubmenu(null)}
                      className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-4 font-bold"
                    >
                      ← {t("common.back") || "Zpět"}
                    </button>
                    {activeSubmenu === "language" ? (
                      <ChangeLanguage />
                    ) : (
                      <ThemeToggle />
                    )}
                  </div>
                )}

                {/* Hlavní menu */}
                {!activeSubmenu && (
                  <div className="py-3 space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase px-4 mb-1 tracking-widest">
                      {t("common.settings") || "Nastavení"}
                    </p>

                    <button
                      onClick={() => setActiveSubmenu("language")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl flex justify-between text-sm dark:text-gray-200"
                    >
                      <span>🌐 {t("common.language")}</span>
                      <span className="opacity-30">›</span>
                    </button>

                    <button
                      onClick={() => setActiveSubmenu("theme")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl flex justify-between text-sm dark:text-gray-200"
                    >
                      <span>✨ {t("common.theme")}</span>
                      <span className="opacity-30">›</span>
                    </button>

                    <hr className="my-3 mx-4 dark:border-gray-700" />

                    <button
                      onClick={() => {
                        setIsChartVisible(true);
                        setIsPopoverOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-sm dark:text-gray-200"
                    >
                      📊 {t("common.showChart") || "Zobrazit statistiky"}
                    </button>

                    <button
                      onClick={() => {
                        setIsMembersListVisible(true);
                        setIsPopoverOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-sm dark:text-gray-200"
                    >
                      👤 {t("pages.shoppingList.editMembers")}
                    </button>

                    <button
                      onClick={resetListToDefault}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-xl text-sm font-medium"
                    >
                      🔄 {t("pages.shoppingList.resetList")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Nadpis seznamu + edit/delete (pro vlastníka) */}
        <header className="flex sm:flex-row items-start gap-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white truncate">
            {name || "Bez názvu"}
          </h1>

          {isOwner && (
            <div className="flex gap-2">
              <EditName
                name={name}
                shopListId={shopListId}
                dispatch={dispatch}
                isOwner={true}
              />
              <DeleteListButton shopListId={shopListId} dispatch={dispatch} />
            </div>
          )}
        </header>

        {/* Filtry */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {FilterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                activeFilter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {t(`pages.shoppingList.filters.${f.toLowerCase()}`)}
            </button>
          ))}
        </div>

        {/* Seznam položek */}
        <ItemList
          items={filteredItems}
          dispatch={dispatch}
          shopListId={shopListId}
          isManager={isManager}
        />

        {/* Přidání nové položky (jen pro manažery) */}
        {isManager && (
          <div className="mt-12 flex justify-end">
            <CreateItem
              userId={currentUserId}
              dispatch={dispatch}
              shopListId={shopListId}
            />
          </div>
        )}

        {/* Modal: Graf */}
        {isChartVisible && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsChartVisible(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">{name}</h2>
                <button
                  onClick={() => setIsChartVisible(false)}
                  className="text-2xl text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="h-64 w-full">
                <ListDetailChart data={dataForChart} />
              </div>
              <div className="mt-6 flex justify-center gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">
                    {completedCount}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {t("common.done")}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-500">
                    {pendingCount}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {t("common.pending")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Členové */}
        {isMembersListVisible && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsMembersListVisible(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold dark:text-white">
                  {t("pages.shoppingList.membersTitle")}
                </h2>
                <button
                  onClick={() => setIsMembersListVisible(false)}
                  className="text-3xl text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <MemberList
                members={members}
                ownerId={ownerId}
                currentUserId={currentUserId}
                dispatch={dispatch}
                shopListId={shopListId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
