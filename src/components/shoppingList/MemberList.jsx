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
export const MemberList = ({ members, ownerId, currentUserId, dispatch }) => {
  const isOwner = ownerId === currentUserId;
  console.log(
    "[MemberList] Rendering for currentUserId:",
    currentUserId,
    "ownerId:",
    ownerId,
    "isOwner:",
    isOwner,
    "members:",
    members
  );
  return (
    <div className="mt-5 p-4 border border-gray-300 rounded-[8px] bg-gray-100">
      {/* HEADER */}
      <h3 className="mb-4 pb-2 border-b-2 border-blue-600 text-blue-800 font-semibold">
        👥 Members ({members.length})
      </h3>
      {/* INVITE FORM – OWNER ONLY */}
      <Invite
        dispatch={dispatch} // ← Invite handles ADD_MEMBER
        isOwner={isOwner}
      />
      {/* MEMBERS LIST */}
      <MembersListContent
        members={members}
        ownerId={ownerId}
        dispatch={dispatch}
        currentUserId={currentUserId}
      />

      {/* DEV DEBUG */}
      {process.env.NODE_ENV === "development" && (
        <small className="block mt-4 text-gray-800 text-xs text-center italic" />
      )}
    </div>
  );
};

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

export const MembersListContent = ({
  members,
  ownerId,
  dispatch,
  currentUserId,
}) => {
  return (
    <div className="border border-gray-200 rounded-[6px] p-3 mb-5 bg-white min-h-[80px]">
      {members.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {members.map((member) => (
            <MemberRow
              currentUserId={currentUserId}
              key={member.memberId}
              member={member}
              ownerId={ownerId}
              dispatch={dispatch} // ← MemberRow handles remove/leave
            />
          ))}
        </div>
      ) : (
        <div className="p-5 text-center text-gray-900 italic bg-gray-200 rounded-[6px]">
          <p>Nobody is here</p>
          <small>(pouze vlastník je automaticky členem)</small>
        </div>
      )}
    </div>
  );
};
