export const getListAuth = (lists, shopListId, userId) => {
  const list = lists.find(
    (l) => l.id === shopListId || l.shopListId === shopListId
  );
  if (!list) return { list: null };

  const members = Array.isArray(list.members) ? list.members : [];
  const isOwner = list.ownerId === userId;
  const isMember = members.some((m) => m.userId === userId);

  const updateList = (updater) => {
    return lists.map((l) =>
      l.id === shopListId || l.shopListId === shopListId ? updater(l) : l
    );
  };

  return { list, isOwner, isMember, members, updateList };
};

export const actionTypes = {
  renameList: "RENAME_LIST",
  addMember: "ADD_MEMBER",
  removeMember: "REMOVE_MEMBER",
  addItem: "ADD_ITEM",
  updateItem: "UPDATE_ITEM",
  toggleItemResolved: "TOGGLE_ITEM_RESOLVED",
  removeItem: "REMOVE_ITEM",
  resetList: "RESET_LIST",
  leaveList: "LEAVE_LIST",
  deleteList: "DELETE_LIST",
  loadLists: "LOAD_LISTS",
  resetHomePage: "RESET_HOMEPAGE",
  addList: "ADD_LIST",
  setLoading: "SET_LOADING",
};
