// src/components/shoppingList/MemberRow.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← Add this
import PropTypes from "prop-types";
import { actionTypes } from "../../context/ReducerHelper";
import { useParams } from "react-router-dom";
import { useShoppingList } from "../../context/ShoppingListContext";
import { useTranslation } from "react-i18next";
import { EditMember } from "./EditMember";

export function MemberRow({ currentUserId, member, ownerId, dispatch }) {
  const { shopListId } = useParams();
  const { actions } = useShoppingList();
  const { removeMember, updateMember, leaveListById } = actions; // Přidáno updateMember z kontextu
  const { t } = useTranslation();
  const navigate = useNavigate();

  // STAV PRO EDITACI

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(member.userName);

  if (!member || !member.memberId) return null;
  const { memberId, userName } = member;

  // AUTH FLAGS

  const isMemberOwner = String(memberId) === String(ownerId);
  const isMe = String(memberId) === String(currentUserId);
  const iAmOwner = String(currentUserId) === String(ownerId); // Jsem já vlastník seznamu?

  // HANDLERS

  const handleSaveEdit = async () => {
    if (newName.trim() && newName !== userName) {
      try {
        await updateMember(shopListId, memberId, { userName: newName.trim() });

        // Reducer se postará o update v globálním stavu
      } catch (error) {
        console.error("Failed to update member name:", error);
      }
    }

    setIsEditing(false);
  };

  const handleRemoveOther = async () => {
    if (isMemberOwner) return;

    if (
      window.confirm(
        t("pages.shoppingList.members.confirmRemove", { name: userName })
      )
    ) {
      await removeMember(shopListId, memberId);

      dispatch({
        type: actionTypes.removeMember,

        payload: { shopListId, memberId },
      });
    }
  };

  const handleLeaveList = async () => {
    if (!isMe) return;

    const confirmed = window.confirm(
      t("pages.shoppingList.members.confirmLeave")
    );

    if (confirmed) {
      try {
        await leaveListById(shopListId, memberId); // memberId = currentUserId

        // SUCCESS → redirect to home
        navigate("/"); // or "/lists" if you have a dedicated page
      } catch (err) {
        console.error("Failed to leave list", err);
        // Optional: show error toast
        alert(t("errors.leaveFailed"));
      }
    }
  };

  const role = isMemberOwner
    ? { text: "Owner", color: "bg-yellow-600" }
    : isMe
    ? { text: "You", color: "bg-blue-600" }
    : { text: "Member", color: "bg-gray-600" };

  return (
    <div
      role="listitem"
      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 
                 border border-gray-200 dark:border-gray-700 rounded-xl 
                 shadow-sm hover:shadow transition-shadow"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Editable Name or Static Text */}
        {isEditing ? (
          <EditMember
            member={member}
            shopListId={shopListId}
            dispatch={dispatch}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          <button
            onClick={() => iAmOwner && !isMemberOwner && setIsEditing(true)}
            className="font-semibold text-gray-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 
                       transition-colors cursor-pointer disabled:cursor-default disabled:hover:text-inherit"
            disabled={!iAmOwner || isMemberOwner}
            title={iAmOwner && !isMemberOwner ? t("common.edit") : ""}
          >
            {userName}
          </button>
        )}

        {/* Role Badge */}
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${role.color}`}
        >
          {role.text}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Edit Button (visible for owner on non-owners) */}
        {iAmOwner && !isMemberOwner && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 
                       text-lg transition-colors scale-x-[-1] ml-1"
            title={t("common.edit")}
            aria-label={t("common.edit")}
          >
            ✎
          </button>
        )}

        {/* Remove Button (owner only, not self) */}
        {iAmOwner && !isMemberOwner && (
          <button
            onClick={handleRemoveOther}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium 
                       px-4 py-2 rounded-lg transition-colors"
          >
            X
          </button>
        )}

        {/* Leave List Button (for current user if not owner) */}
        {isMe && !isMemberOwner && (
          <button
            onClick={handleLeaveList}
            className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-medium 
                       px-4 py-2 rounded-lg transition-colors"
          >
            {t("pages.shoppingList.members.leave")}
          </button>
        )}
      </div>
    </div>
  );
}

MemberRow.propTypes = {
  currentUserId: PropTypes.string.isRequired,

  member: PropTypes.shape({
    memberId: PropTypes.string.isRequired,

    userName: PropTypes.string.isRequired,

    email: PropTypes.string.isRequired,
  }).isRequired,

  ownerId: PropTypes.string.isRequired,

  dispatch: PropTypes.func.isRequired,
};
