import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { actionTypes } from "../../context/ReducerHelper";
import { Invite } from "./Invite";

import { MemberRow } from "./MemberRow";

export function MemberList({
  members,
  ownerId,
  currentUserId,
  dispatch,
  shopListId,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null); // Nový stav
  const menuRef = useRef(null);
  const { t } = useTranslation();
  const isOwner = currentUserId === ownerId;
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRemoveMember = (memberId) => {
    if (window.confirm(t("pages.shoppingList.confirmRemoveMember"))) {
      dispatch({
        type: actionTypes.removeMember,
        payload: { shopListId, memberId },
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. INVITE COMPONENT */}
      <Invite dispatch={dispatch} isOwner={isOwner} userId={currentUserId} />

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      {/* 2. MEMBERS LIST */}
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-4 dark:text-white px-2">
          {t("pages.shoppingList.members.title")} ({members.length})
        </h3>

        {/* Using a div container because MemberRow (with inline styles) is a div */}
        <div className="flex flex-col gap-2">
          {members.map((member) => (
            <MemberRow
              key={member.memberId || member._id}
              member={member}
              ownerId={ownerId}
              currentUserId={currentUserId}
              dispatch={dispatch}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
