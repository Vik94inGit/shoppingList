// src/constants/initialData.js

export let SHOPPING_LIST_DATA = {
  shopListId: "sl-1",
  name: "Týdenní nákup",
  ownerId: "user-owner-123",
  members: [
    {
      userId: "user-owner-123",
      userName: "Jana (Vlastník)",
      email: "owner@example.com",
    },
    {
      userId: "user-member-456",
      userName: "Petr (Člen)",
      email: "member@example.com",
    },
  ],
  items: [
    { itemId: "item-1", itemName: "Mléko", count: 1, isResolved: false },
    { itemId: "item-2", itemName: "Chléb", count: 2, isResolved: true },
    { itemId: "item-3", itemName: "Máslo", count: 1, isResolved: false },
  ],
};

export const CURRENT_USER_ID = "user-owner-123"; // Simulace aktuálně přihlášeného uživatele
