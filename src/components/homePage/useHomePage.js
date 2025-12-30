// src/api/shoppingListApi.js

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
// Adjust the base URL/path according to your Express routes (e.g. /api/lists)

// Helper to get the auth token from sessionStorage (or localStorage if you prefer)
const getAuthToken = () => sessionStorage.getItem("token");

// Generic fetch wrapper that adds the Authorization header
export const authFetch = async (url, options = {}) => {
  const token = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // Attach the status to the error object
    const error = new Error(errorData.error || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  // Some endpoints return nothing (e.g. DELETE), so return empty object if no content
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return {};
};

// ====================== API FUNCTIONS ======================

/**
 * Get all shopping lists for the logged-in user
 */
export const fetchAllLists = async () => {
  return authFetch(`${API_BASE_URL}/lists`);
};

/**
 * Get a single shopping list by ID
 * @param {string} shopListId
 */
export const fetchListById = async (shopListId) => {
  return authFetch(`${API_BASE_URL}/lists/${shopListId}`);
};

/**
 * Create a new shopping list
 * @param {object} data  { name: string, items?: array, members?: array }
 */
export const createList = async (data) => {
  return authFetch(`${API_BASE_URL}/lists`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Update an existing shopping list (full or partial update)
 * @param {string} shopListId
 * @param {object} data  fields to update
 */
export const updateList = async (shopListId, updates) => {
  // authFetch will throw an Error if !response.ok
  // So if this line finishes, the request was successful.
  const data = await authFetch(`${API_BASE_URL}/lists/${shopListId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

  console.log("Updated data in useHomePage for update", updates);

  // 'data' is the parsed JSON returned from authFetch
  console.log("Update successful:", data);
  return data;
};

export const resetDatabase = async () => {
  // authFetch zajistí, že req.user.id na backendu bude existovat
  const response = await authFetch(`${API_BASE_URL}/lists/dev/reset`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Reset databáze selhal");
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return { message: "Reset proběhl úspěšně" };
};

export const archiveList = async (shopListId, updates) => {
  // authFetch will throw an Error if !response.ok
  // So if this line finishes, the request was successful.
  const data = await authFetch(`${API_BASE_URL}/lists/${shopListId}/archive`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

  console.log("Updated data in useHomePage for update", updates);

  // 'data' is the parsed JSON returned from authFetch
  console.log("Update successful:", data);
  return data;
};

/**
 * Delete a shopping list
 * @param {string} shopListId
 */
export const deleteList = async (shopListId) => {
  return authFetch(`${API_BASE_URL}/lists/${shopListId}`, {
    method: "DELETE",
  });
};
