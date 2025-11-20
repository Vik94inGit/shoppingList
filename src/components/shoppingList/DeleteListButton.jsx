// src/components/shoppingList/DeleteListButton.jsx
import React from "react"
import PropTypes from "prop-types"
import { useNavigate, useParams } from "react-router-dom"
import { actionTypes } from "../../context/ReducerHelper"

export function DeleteListButton({ userId, ownerId, dispatch }) {
  // UI authorisation: Show button only to the owner
  const isOwner = ownerId === userId
  const { listId } = useParams()
  const navigate = useNavigate()
  if (!isOwner) return null

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Opravdu chcete smazat nákupní seznam? Tato akce je nevratná."
    )

    if (confirmed) {
      dispatch({ type: actionTypes.deleteList, payload: { listId } })
      navigate("/")
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      aria-label="Smazat celý nákupní seznam"
    >
      🗑️
    </button>
  )
}

// PropTypes validation (only in development)
DeleteListButton.propTypes = {
  userId: PropTypes.string.isRequired,
  ownerId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
}
