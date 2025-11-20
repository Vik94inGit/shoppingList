export const CURRENT_USER_ID = "user-member-456" // Simulace aktuálně přihlášeného uživatele

export let SHOPPING_LIST_DATA = [
  {
    shopListId: "sl-1",
    name: "Týdenní nákup 1",
    ownerId: "user-member-123",
    members: [
      {
        userId: "user-member-123",
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
      { itemId: "item-21", itemName: "Mléko", count: 1, isResolved: false },
      { itemId: "item-32", itemName: "Chléb", count: 2, isResolved: true },
      { itemId: "item-43", itemName: "Máslo", count: 1, isResolved: false },
    ],
  },
  {
    shopListId: "sl-2",
    name: "Týdenní nákup 2",
    ownerId: "user-member-466",
    members: [
      {
        userId: "user-member-123",
        userName: "Jana (Vlastník)",
        email: "owner@example.com",
      },
      {
        userId: "user-member-456",
        userName: "Petr (Člen)",
        email: "member@example.com",
      },
      {
        userId: "user-member-466",
        userName: "Martin (Člen)",
        email: "member@example.com",
      },
    ],
    items: [
      { itemId: "item-11", itemName: "Mléko", count: 1, isResolved: false },
      { itemId: "item-22", itemName: "Chléb", count: 2, isResolved: true },
      { itemId: "item-33", itemName: "Máslo", count: 1, isResolved: false },
      { itemId: "item-14", itemName: "Mléko", count: 1, isResolved: false },
      { itemId: "item-25", itemName: "Chléb", count: 2, isResolved: true },
      { itemId: "item-36", itemName: "Máslo", count: 1, isResolved: false },
    ],
  },
  {
    shopListId: "sl-3",
    name: "Týdenní nákup 3",
    ownerId: "user-member-456",
    members: [
      {
        userId: "user-member-123",
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
      { itemId: "item-4", itemName: "Mléko", count: 1, isResolved: false },
      { itemId: "item-5", itemName: "Chléb", count: 2, isResolved: true },
      { itemId: "item-6", itemName: "Máslo", count: 1, isResolved: false },
    ],
  },
]

export const initialState = {
  lists: [], // ← bude naplněno z localStorage nebo mocku
  loading: true, // ← čekáme na data
  currentUserId: CURRENT_USER_ID,
}
