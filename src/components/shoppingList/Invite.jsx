// src/components/shoppingList/Invite.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { actionTypes } from "../../context/ReducerHelper";
import { useTranslation } from "react-i18next";
import { useShoppingList } from "../../context/ShoppingListContext.jsx";
import { useParams } from "react-router-dom";
import { addMemberToList } from "../shoppingList/useShoppingList.js";

/**
 * INVITE COMPONENT – OWNER-ONLY INVITATION FORM
 *
 * DATAFLOW (krok za krokem):
 * 1. Props → `userId`, `dispatch`, `isOwner`
 * 2. Mount → `email=""`, `userName=""`
 * 3. Input changes → `setEmail`, `setUserName` + LOG
 * 4. Submit → validate → dispatch(ADD_MEMBER) → reset + LOG
 * 5. Non-owner → returns null (no render)
 *
 * LOGS: prefixed with `[Invite]` → filter in Console!
 */
export function Invite({ dispatch, isOwner }) {
  // LOCAL STATE
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");

  const { t } = useTranslation();

  const { shopListId } = useParams();
  const [status, setStatus] = useState({ type: null, text: "" });

  // OWNER CHECK
  if (!isOwner) {
    return null;
  }

  // HANDLE INPUT CHANGES
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = userName.trim();

    if (!trimmedEmail) {
      setStatus({
        type: "error",
        text: t("components.invite.errors.required"),
      });
      return;
    }

    const userData = {
      email: trimmedEmail,
      userName: trimmedName || undefined,
    };

    try {
      const newMemberFromBackend = await addMemberToList(shopListId, userData);
      console.log("[Invite] Member added:", newMemberFromBackend);

      dispatch({
        type: actionTypes.addMember,
        payload: {
          shopListId,
          memberId: newMemberFromBackend.memberId || newMemberFromBackend.id, // Ensure this field matches your API
          userName: newMemberFromBackend.userName || trimmedName,
          email: newMemberFromBackend.email || trimmedEmail,
        },
      });

      // Show success message
      setStatus({
        type: "success",
        text: t("components.invite.success", {
          name: userName || trimmedEmail,
        }),
      });

      // Clear form
      setEmail("");
      setUserName("");
    } catch (error) {
      console.error("Failed to add member:", error);

      // Determine error message
      let errorMsg = t("components.invite.errors.default");
      if (error.message?.includes("already a member")) {
        errorMsg = t("components.invite.errors.alreadyMember");
      } else if (error.message?.includes("not registered")) {
        errorMsg = t("components.invite.errors.notRegistered");
      }

      setStatus({ type: "error", text: errorMsg });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Optional title */}
      {/* <h4 className="text-xl font-bold mb-5">Pozvat člena</h4> */}

      {status.type && (
        <div
          className={`mb-5 p-4 rounded-xl text-sm font-medium border ${
            status.type === "success"
              ? "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"
          }`}
        >
          {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("components.invite.fields.name")}{" "}
            <span className="text-gray-500">(volitelné)</span>
          </label>
          <input
            id="invite-name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder={t("components.invite.placeholders.name")}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("components.invite.fields.email")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="invite-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("components.invite.placeholders.email")}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-xl shadow-md hover:shadow-lg transition"
        >
          {t("components.invite.submit")}
        </button>
      </form>
    </div>
  );
}

// PropTypes – runtime validation
Invite.propTypes = {
  userId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired,
};
