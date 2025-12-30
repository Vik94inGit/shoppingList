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
    <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl shadow-lg">
      {/* Header */}
      <h4 className="text-xl font-bold text-blue-800 dark:text-gray-100 mb-5">
        {t("components.invite.title")}
      </h4>

      {/* Status Message */}
      {status.type && (
        <div
          className={`mb-5 p-4 rounded-xl text-sm font-medium transition-all ${
            status.type === "success"
              ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
              : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
          }`}
        >
          {status.text}
        </div>
      )}

      {/* Form - Přidáno items-end pro zarovnání spodní hrany */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-y-4 dark:text-red dark:bg-gray-10000 "
        aria-label={t("components.invite.formAria")}
      >
        {/* Name Input */}
        <div className="w-full flex-1 sm:flex-1">
          <label
            htmlFor="invite-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t("components.invite.fields.name")}
          </label>
          <input
            id="invite-name"
            type="text"
            maxLength={30}
            placeholder={t("components.invite.placeholders.name")}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-3 border border-blue-300 dark:border-blue-600 rounded-xl 
                       bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-white 
                       placeholder-gray-500 dark:placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                       transition disabled:opacity-60"
            required
          />
        </div>

        {/* Email Input */}
        <div className="w-full sm:flex-1">
          <label
            htmlFor="invite-email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-700 mb-1"
          >
            {t("components.invite.fields.email")}
          </label>
          <input
            id="invite-email"
            type="email"
            maxLength={30}
            placeholder={t("components.invite.placeholders.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-blue-300 dark:border-blue-600 rounded-xl 
                       bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-white 
                       placeholder-gray-500 dark:placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                       transition disabled:opacity-60"
            required
          />
        </div>

        {/* Submit Button - Odstraněno flex items-end div, tlačítko je nyní přímo v gridu/flexu */}
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 h-[50px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed 
                     text-white font-semibold rounded-xl shadow-md hover:shadow-lg 
                     transition-all duration-200 
                     focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
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
