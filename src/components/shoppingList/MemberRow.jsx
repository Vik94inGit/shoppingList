// src/components/shoppingList/MemberRow.jsx

import { useState } from "react";
import PropTypes from "prop-types";
import { actionTypes } from "../../context/ReducerHelper";
import { useParams } from "react-router-dom";
import { useShoppingList } from "../../context/ShoppingListContext";
import { useTranslation } from "react-i18next";
import { EditMember } from "./EditMember";

export function MemberRow({ currentUserId, member, ownerId, dispatch }) {
  const { shopListId } = useParams();
  const { actions } = useShoppingList();
  const { removeMember, updateMember } = actions; // Přidáno updateMember z kontextu
  const { t } = useTranslation();

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

  const role = isMemberOwner
    ? { text: "Owner", color: "#d4af37" }
    : isMe
    ? { text: "You", color: "#007bff" }
    : { text: "Member", color: "#6c757d" };

  return (
    <div
      role="listitem"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 8px",
        borderBottom: "1px dotted #dee2e6",
        backgroundColor: "#8c939bff",
        borderRadius: "6px",
        margin: "2px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* EDITACE JMÉNA VS STATICKÝ TEXT */}

        {isEditing ? (
          <EditMember
            member={member}
            shopListId={shopListId}
            dispatch={dispatch}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          <strong
            onClick={() => setIsEditing(true)}
            style={{
              color: "#212529",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "120px",
              display: "inline-block",
            }}
          >
            {userName}
          </strong>
        )}

        <span
          style={{
            backgroundColor: role.color,

            color: "white",

            fontSize: "11px",

            fontWeight: "bold",

            padding: "2px 6px",

            borderRadius: "4px",
          }}
        >
          {role.text}
        </span>
      </div>

      {/* ACTION BUTTONS */}

      <div style={{ display: "flex", gap: "6px" }}>
        {/* EDIT TLAČÍTKO (Jen pro vlastníka u ostatních členů) */}

        {iAmOwner && !isMemberOwner && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              background: "none",

              border: "none",

              cursor: "pointer",

              fontSize: "16px",
            }}
            title={t("common.edit")}
          >
            ✎
          </button>
        )}

        {/* REMOVE TLAČÍTKO */}

        {iAmOwner && !isMemberOwner && (
          <button
            onClick={handleRemoveOther}
            style={{
              backgroundColor: "#dc3545",

              color: "white",

              border: "none",

              padding: "6px 10px",

              borderRadius: "4px",

              cursor: "pointer",

              fontSize: "12px",
            }}
          >
            {t("pages.shoppingList.members.remove")}
          </button>
        )}

        {/* LEAVE TLAČÍTKO */}

        {isMe && !isMemberOwner && (
          <button
            onClick={() => {
              /* handleLeaveList logic */
            }}
            style={{
              backgroundColor: "#ffc107",

              color: "black",

              border: "none",

              padding: "6px 10px",

              borderRadius: "4px",

              cursor: "pointer",

              fontSize: "12px",
            }}
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
