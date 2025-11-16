export const getListAuth = (lists, listId, userId) => {
  const list = lists.find((l) => l.id === listId || l.shopListId === listId);
  if (!list) return { list: null };

  const members = Array.isArray(list.members) ? list.members : [];
  const isOwner = list.ownerId === userId;
  const isMember = members.some((m) => m.userId === userId);

  const updateList = (updater) => {
    return lists.map((l) =>
      l.id === listId || l.shopListId === listId ? updater(l) : l
    );
  };

  return { list, isOwner, isMember, members, updateList };
};
