import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useShoppingList } from "../../context/ShoppingListContext";
import ShoppingListCard from "./ShoppingListCard";
import CreateListModal from "./CreateList";
import { useNavigate } from "react-router-dom";
import { actionTypes } from "../../context/ReducerHelper";
import { LogoutButton } from "../logPage/logOut";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "../ThemeToggle.jsx";
import { ChangeLanguage } from "../ChangeLanguage.jsx";
import { resetDatabase } from "./useHomePage.js";

export default function HomePage() {
  // ── UI state ─────────────────────────────────────────────────────
  const [filter, setFilter] = useState("all"); // "all" | "owned" | "shared"
  const [modalOpen, setModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { t } = useTranslation();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  // ── Global state ─────────────────────────────────────────────────
  const {
    lists,
    loading,
    currentUser, // ← renamed from currentUserId
    dispatch,
    actions, // ← new: createNewList, deleteListById, etc.
  } = useShoppingList();
  const navigate = useNavigate(); // ← for navigation
  // ── Filtered lists (memoised) ───────────────────────────────────
  const menuRef = useRef(null);
  console.log(currentUser, "currentUser in HomePage");

  console.log(
    "lists in HomePage:",
    lists,
    "currentUser in HomePage:",
    currentUser
  );

  const currentUserId = currentUser?.id;

  const filteredLists = useMemo(() => {
    if (!currentUserId || !Array.isArray(lists)) return [];

    // STEP 1: Get all lists this user is allowed to see (Active OR Archived)
    const accessibleLists = lists.filter((list) => {
      const isOwner = list.ownerId === currentUserId;
      const isMember =
        Array.isArray(list.members) &&
        list.members.some((m) => m.memberId === currentUserId);
      return isOwner || isMember;
    });

    // STEP 2: Apply specific view filters
    if (filter === "archived") {
      // Show ONLY archived lists (regardless of ownership)
      return accessibleLists.filter((l) => l.isArchived === true);
    }

    if (filter === "owned") {
      // Show ONLY active lists owned by me
      return accessibleLists.filter(
        (l) => l.ownerId === currentUserId && !l.isArchived
      );
    }

    if (filter === "shared") {
      // Show ONLY active lists shared with me
      return accessibleLists.filter(
        (l) =>
          l.ownerId !== currentUserId &&
          l.members?.some((m) => m.memberId === currentUserId) &&
          !l.isArchived
      );
    }

    // DEFAULT ("all"): Show all active lists (owned + shared)
    return accessibleLists.filter((l) => !l.isArchived);
  }, [lists, currentUserId, filter]);

  const handleCardClick = useCallback(
    (shopListId) => {
      navigate(`/list/${shopListId}`);
    },
    [navigate]
  );

  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsPopoverOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // ── Reset handler ───────────────────────────────────────────────
  const resetListsToDefault = useCallback(async () => {
    if (!window.confirm(t("pages.shoppingLists.confirmReset"))) return;

    try {
      // 1. Zavoláme reset (DB se smaže)
      await resetDatabase();

      // 2. SMAŽEME TOKEN - starý token je už neplatný, protože uživatel v DB neexistuje
      sessionStorage.removeItem("token");

      // 3. PŘESMĚROVÁNÍ na registraci
      // Použijte window.location pro tvrdý restart aplikace
      window.location.href = "/register";
    } catch (error) {
      console.error("Reset failed:", error);
      // I když reset selže na parsování, pokud víme, že DB je pryč,
      // je lepší uživatele odhlásit taky.
      sessionStorage.removeItem("token");
      window.location.href = "/register";
    }
  }, [t]);
  // 2. Guard against missing user after loading finishes
  if (!currentUser) {
    return (
      <div>
        {t(
          "pages.shoppingLists.pleaseLogin",
          "Please log in to view your lists."
        )}
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────
  if (loading)
    return (
      <p className="p-4 text-center text-gray-600 dark:text-gray-300">
        {t("common.loading", "Loading…")}
      </p>
    );

  return (
    <div className="p-4 max-w-5xl mx-auto mt-8">
      {/* HEADER: Zarovnání Nadpis vlevo, Menu vpravo */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          {t("pages.shoppingLists.title")}
        </h1>

        <div className="flex items-center gap-3" ref={menuRef}>
          <LogoutButton />

          <div className="relative">
            <button
              onClick={() => {
                setIsPopoverOpen((p) => !p);
                setActiveSubmenu(null); // Reset submenu při otevření/zavření
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-sm text-xl text-gray-600 dark:text-gray-200"
            >
              ⋯
            </button>

            {isPopoverOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-2xl rounded-2xl z-50 overflow-hidden p-2">
                {/* --- SUBMENU: Jazyk nebo Téma --- */}
                {activeSubmenu ? (
                  <div className="p-2 animate-in slide-in-from-right-2 duration-200">
                    <button
                      onClick={() => setActiveSubmenu(null)}
                      className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-3 font-bold hover:underline"
                    >
                      ← {t("common.back", "Zpět")}
                    </button>

                    {activeSubmenu === "language" ? (
                      <div className="py-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase px-2 mb-2 tracking-widest">
                          {t("common.selectLanguage", "Vyberte jazyk")}
                        </p>
                        <ChangeLanguage />
                      </div>
                    ) : (
                      <div className="py-1 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase px-2 mb-4 tracking-widest text-left">
                          {t("common.selectTheme", "Vyberte téma")}
                        </p>
                        <ThemeToggle />
                      </div>
                    )}
                  </div>
                ) : (
                  /* --- HLAVNÍ MENU --- */
                  <div className="animate-in fade-in duration-200 space-y-1">
                    {/* Sekce Nastavení */}
                    <p className="text-[10px] font-bold text-gray-400 uppercase px-3 py-1 tracking-widest">
                      {t("common.settings", "Nastavení")}
                    </p>
                    <button
                      onClick={() => setActiveSubmenu("language")}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl flex justify-between items-center text-sm dark:text-gray-200"
                    >
                      <span>🌐 {t("common.language", "Jazyk")}</span>
                      <span className="text-gray-400">›</span>
                    </button>
                    <button
                      onClick={() => setActiveSubmenu("theme")}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl flex justify-between items-center text-sm dark:text-gray-200"
                    >
                      <span>✨ {t("common.theme", "Téma")}</span>
                      <span className="text-gray-400">›</span>
                    </button>

                    <hr className="my-2 dark:border-gray-700" />

                    {/* Sekce Filtry */}
                    <p className="text-[10px] font-bold text-gray-400 uppercase px-3 py-1 tracking-widest">
                      {t("common.filter", "Zobrazení")}
                    </p>
                    {["all", "owned", "shared", "archived"].map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          setFilter(f);
                          setIsPopoverOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                          filter === f
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {f === "all" &&
                          t("pages.shoppingLists.filterAll", "Všechny seznamy")}
                        {f === "owned" &&
                          t("pages.shoppingLists.filterOwned", "Moje seznamy")}
                        {f === "shared" &&
                          t(
                            "pages.shoppingLists.filterShared",
                            "Sdílené se mnou"
                          )}
                        {f === "archived" &&
                          t(
                            "pages.shoppingLists.filterArchived",
                            "Archivované"
                          )}
                      </button>
                    ))}

                    <hr className="my-2 dark:border-gray-700" />

                    {/* Sekce Akce */}
                    <button
                      onClick={() => {
                        setModalOpen(true);
                        setIsPopoverOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl text-sm font-bold hover:bg-green-100 transition-colors"
                    >
                      ➕ {t("pages.shoppingLists.newList", "Nový seznam")}
                    </button>

                    <button
                      onClick={() => {
                        resetListsToDefault();
                        setIsPopoverOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-medium transition-colors"
                    >
                      🔄 {t("common.reset", "Resetovat")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── List of cards ── */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLists.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {t(
                `pages.shoppingLists.empty.${filter}`,
                "Žádné seznamy k zobrazení."
              )}
            </p>
          </div>
        ) : (
          filteredLists.map((list) => (
            <ShoppingListCard
              key={list.shopListId}
              list={list}
              isOwner={list.ownerId === currentUserId}
              isMember={
                list.ownerId !== currentUserId &&
                list.members?.some((m) => m.memberId === currentUserId)
              }
              dispatch={dispatch}
              onClick={() => handleCardClick(list.shopListId)}
            />
          ))
        )}
      </section>

      <CreateListModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
