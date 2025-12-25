// src/components/shoppingList/MemberRow.jsx
import React from "react";
import PropTypes from "prop-types";
import { actionTypes } from "../../context/ReducerHelper";
import { useParams } from "react-router-dom";
import { useShoppingList } from "../../context/ShoppingListContext";
/**
 * MEMBERROW – SINGLE MEMBER WITH REMOVE/LEAVE ACTION
 *
 * DATAFLOW
 * 1. Props → member, ownerId, currentUserId, dispatch
 * 2. Derive → isOwner, isCurrentUser, canRemoveOther
 * 3. Actions:
 *    • Owner → REMOVE_MEMBER (other users)
 *    • Member → LEAVE_LIST (self)
 * 4. Confirm dialog + dispatch
 *
 * LOGS → [MemberRow]
 */
export default function MemberRow({
  currentUserId,
  member,
  ownerId,
  dispatch,
}) {
  const { shopListId } = useParams();
  const { actions } = useShoppingList();
  const { removeMember } = actions;
  console.log(
    "[MemberRow] Rendering member:",
    member,
    "of list:",
    shopListId,
    "for currentUserId:",
    currentUserId,
    typeof member.memberId
  );
  //
  // 1. DEFENSIVE CHECK
  // -------------------------------------------------
  if (!member || !member.memberId) {
    console.warn("[MemberRow] Invalid member prop:", member);
    return null;
  }

  const { memberId, userName, email } = member;

  // -------------------------------------------------
  // 2. AUTH FLAGS
  // -------------------------------------------------

  const isOwner = ownerId === memberId;
  const isCurrentUser = currentUserId === memberId;
  const isListOwner = currentUserId === ownerId;

  // -------------------------------------------------
  // 3. ACTION HANDLERS
  // -------------------------------------------------
  const handleRemoveOther = async () => {
    if (isOwner) {
      alert("Nelze odstranit vlastníka seznamu.");
      return;
    }

    if (!isListOwner) {
      alert("Nemáte oprávnění odstraňovat členy.");
      return;
    }
    const confirmed = window.confirm(
      `You really want to remove **${userName}** (${email})?`
    );
    if (confirmed) {
      console.log("[MemberRow] Removing memberId:", memberId);
      await removeMember(shopListId, memberId);
      dispatch({
        type: actionTypes.removeMember,
        payload: { shopListId, memberId },
      });
    }
  };

  const handleLeaveList = async () => {
    if (!isOwner && isCurrentUser) {
      console.log("[MemberRow] Leaving list for userId:", currentUserId);
      if (!window.confirm(`Opravdu chcete opustit seznam?`)) return;
      await deleteMember(shopListId, memberId);
      dispatch({
        type: actionTypes.leaveList,
        payload: { shopListId, userId: currentUserId },
      });
    }
  };

  // -------------------------------------------------
  // 4. ROLE BADGE
  // -------------------------------------------------
  const getRoleBadge = () => {
    if (isOwner) return { text: "Owner", color: "#d4af37", icon: "Owner" };
    if (isCurrentUser) return { text: "You", color: "#007bff", icon: "You" };
    return { text: "Member", color: "#6c757d", icon: "" };
  };

  const role = getRoleBadge();

  // -------------------------------------------------
  // 5. RENDER
  // -------------------------------------------------
  return (
    <div
      role="listitem"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 8px",
        borderBottom: "1px dotted #dee2e6",
        backgroundColor: "#f8f9fa",
        borderRadius: "6px",
        margin: "2px 0",
      }}
    >
      {/* USER INFO */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <strong style={{ color: "#212529" }}>{userName}</strong>

        <span
          style={{
            backgroundColor: role.color,
            color: "white",
            fontSize: "11px",
            fontWeight: "bold",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
          aria-label={role.text}
        >
          {role.text}
        </span>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: "flex", gap: "6px" }}>
        {/* OWNER: Remove other member */}
        {isListOwner && !isCurrentUser && !isOwner && (
          <button
            onClick={handleRemoveOther}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
            aria-label={`Odebrat ${userName}`}
          >
            Remove
          </button>
        )}

        {/* MEMBER: Leave list */}
        {isCurrentUser && !isOwner && (
          <button
            onClick={handleLeaveList}
            style={{
              backgroundColor: "#ffc107",
              color: "black",
              border: "none",
              padding: "6px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
            aria-label="Opustit seznam"
          >
            Leave
          </button>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------
// PropTypes
// -------------------------------------------------
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
