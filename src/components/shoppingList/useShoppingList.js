const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"; // ← also fix port if needed (you use 4000)

import { authFetch } from "../homePage/useHomePage.js";

/**
 * Add a new item to a specific shopping list
 */
export const addItemToList = async (shopListId, itemData) => {
  return authFetch(`${API_BASE_URL}/ShoppingList/${shopListId}/items`, {
    method: "POST",
    body: JSON.stringify(itemData),
  });
};

/**
 * Delete an item
 */
export const deleteItem = async (shopListId, itemId) => {
  return authFetch(
    `${API_BASE_URL}/ShoppingList/${shopListId}/items/${itemId}`,
    {
      method: "DELETE",
    }
  );
};

/**
 * Update an item (e.g. toggle resolved, change count/name)
 */
export const updateItem = async (shopListId, itemId, itemData) => {
  return authFetch(
    `${API_BASE_URL}/ShoppingList/${shopListId}/items/${itemId}`,
    {
      method: "PATCH",
      body: JSON.stringify(itemData),
    }
  );
};

/**
 * Add a member to the list
 */
export const addMemberToList = async (shopListId, memberData) => {
  console.log("Adding member to list:", shopListId, memberData);
  return authFetch(`${API_BASE_URL}/ShoppingList/${shopListId}/members`, {
    method: "POST",
    body: JSON.stringify({
      userName: memberData.userName,
      email: memberData.userEmail || memberData.email, // adapt to what backend expects
    }),
  });
};

export const updateMember = async (shopListId, memberId, memberData) => {
  return authFetch(
    `${API_BASE_URL}/ShoppingList/${shopListId}/members/${memberId}`,
    {
      method: "PATCH",
      body: JSON.stringify(memberData),
    }
  );
};
/**
 * Remove a member from the list
 */
export const deleteMember = async (shopListId, memberId) => {
  console.log("Deleting member from list:", shopListId, "memberId:", memberId);
  return authFetch(
    `${API_BASE_URL}/ShoppingList/${shopListId}/members/${memberId}`,
    {
      method: "DELETE",
    }
  );
};

export const leaveList = async (shopListId, memberId) => {
  console.log("Deleting member from list:", shopListId, "memberId:", memberId);
  return authFetch(
    `${API_BASE_URL}/ShoppingList/${shopListId}/members/${memberId}/leaveList`,
    {
      method: "DELETE",
    }
  );
};
