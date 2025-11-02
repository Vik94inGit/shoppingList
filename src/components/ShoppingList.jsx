// Import dceřiných UI komponent
import { use, useState } from "react";
import EditName from "./shoppingList/EditName";
import MemberList from "./shoppingList/MemberList";
import ItemsList from "./shoppingList/ItemsList";
import DeleteListButton from "./shoppingList/DeleteListButton";
import CreateItemForm from "./shoppingList/CreateItemForm";
import { useShoppingList } from "../context/shoppingListContext";

export function ShoppingList() {
  const [showResolvedItems, setShowResolvedItems] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Získání stavu a dispečera (logiky) z Contextu
  // Dispečer se předává DOLŮ
  const { listData, dispatch, userId } = useShoppingList();

  // --- DATA a AUTORIZACE ---
  const { shopListId, ownerId, name, members, items } = listData;

  const isOwner = ownerId === userId;
  const isMember = members.some((m) => m.userId === userId);
  const isManager = isOwner || isMember;

  // Tato komponenta NEMÁ ŽÁDNÉ FUNKCE handle* nebo dispatch*
  // Všechny akce, včetně logiky pro přepínání filtru (UI logika), jsou přesunuty do dceřiných komponent.

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          position: "relative",
        }}
      >
        <EditName name={name} ownerId={ownerId} />
        <div
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "50%",
              color: "black",
              width: 24,
              height: 24,
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => setIsPopoverOpen((prev) => !prev)}
          >
            •••
          </div>
          {isPopoverOpen && (
            <div style={{ position: "absolute", background: "white" }}>
              <MemberList
                members={members}
                ownerId={ownerId}
                userId={userId}
                dispatch={dispatch} // Předává dispatch
              />
            </div>
          )}
        </div>
      </div>

      <p>
        Aktuální uživatel ID: **{userId}** (
        {isOwner ? "**VLASTNÍK**" : isMember ? "**ČLEN**" : "**HOST**"})
      </p>

      {/* Sekce pro správu (Edit, MemberList, Delete) */}
      <section
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "20px",
        }}
      >
        <h2>📝 Správa Seznamu</h2>

        {/* MemberList Komponenta - Bude volat DISPATCH uvnitř sebe */}

        {/* Delete Komponenta - Bude volat DISPATCH uvnitř sebe */}
        <DeleteListButton
          shopListId={shopListId}
          userId={userId}
          ownerId={ownerId}
          dispatch={dispatch} // Předává dispatch
        />
        <button
          onClick={() => {
            localStorage.removeItem("shoppingList");
            window.location.reload();
          }}
          style={{ color: "red" }}
        >
          Reset to Initial Data
        </button>
      </section>

      {/* Sekce pro položky */}
      <section style={{ border: "1px solid #ccc", padding: "15px" }}>
        <h2>🧺 Položky (Celkem: {items.length})</h2>

        {/* Create Komponenta - Bude volat DISPATCH uvnitř sebe */}
        {isManager && (
          <CreateItemForm
            userId={userId}
            dispatch={dispatch} // Předává dispatch
          />
        )}

        {/* Item Komponenta (ItemsList) - Bude volat DISPATCH uvnitř sebe */}
        <ItemsList
          items={items}
          shopListId={shopListId}
          isManager={isManager}
          showResolvedItems={showResolvedItems}
          onToggleResolvedItems={() => setShowResolvedItems((prev) => !prev)} // UI logika zůstává
          dispatch={dispatch} // Předává dispatch
        />
      </section>
    </div>
  );
}
