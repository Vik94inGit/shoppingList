// src/components/shoppingList/MemberList.jsx
import React from "react";
import PropTypes from "prop-types";
import MemberRow from "./MemberRow.jsx"; // Fixed: correct component name
import Invite from "./Invite.jsx";

/**
 * MEMBERLIST – DISPLAYS ALL LIST MEMBERS + INVITE FORM
 *
 * DATAFLOW:
 * 1. Props → `members[]`, `ownerId`, `userId`, `dispatch`
 * 2. Compute → `isOwner`, `memberArray` (defensive)
 * 3. Render:
 *    - Header with live count
 *    - List of <MemberRow /> (each gets dispatch)
 *    - <Invite /> (owner-only)
 * 4. Actions → delegated to child components
 *
 * LOGS: `[MemberList]` prefix
 */
export function MemberList({ members, ownerId, userId, dispatch }) {
  // AUTH + SAFETY
  const isOwner = ownerId === userId;
  const memberArray = Array.isArray(members) ? members : [];

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "16px",
        border: "1px solid #dee2e6",
        borderRadius: "8px",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* HEADER */}
      <h3
        style={{
          margin: "0 0 16px 0",
          paddingBottom: "10px",
          borderBottom: "2px solid #007bff",
          color: "#1565c0",
          fontWeight: "600",
        }}
      >
        👥 Members ({memberArray.length})
      </h3>

      {/* MEMBERS LIST */}
      <div
        style={{
          border: "1px solid #e9ecef",
          borderRadius: "6px",
          padding: "12px",
          marginBottom: "20px",
          backgroundColor: "#ffffff",
          minHeight: "80px",
        }}
      >
        {memberArray.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {memberArray.map((member) => (
              <MemberRow
                key={member.userId}
                member={member}
                ownerId={ownerId}
                currentUserId={userId}
                dispatch={dispatch} // ← MemberRow handles remove/leave
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#252628ff",
              fontStyle: "italic",
              backgroundColor: "#f1f3f5",
              borderRadius: "6px",
            }}
          >
            <p>Seznam členů je prázdný</p>
            <small>(pouze vlastník je automaticky členem)</small>
          </div>
        )}
      </div>

      {/* INVITE FORM – OWNER ONLY */}
      <Invite
        userId={userId}
        dispatch={dispatch} // ← Invite handles ADD_MEMBER
        isOwner={isOwner}
      />

      {/* DEV DEBUG */}
      {process.env.NODE_ENV === "development" && (
        <small
          style={{
            display: "block",
            marginTop: "16px",
            color: "#31280cff",
            fontSize: "12px",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          DevTools → filter `[MemberList]` for data flow
        </small>
      )}
    </div>
  );
}

// PropTypes – runtime validation
MemberList.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.string.isRequired,
      userName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ),
  ownerId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

MemberList.defaultProps = {
  members: [],
};
