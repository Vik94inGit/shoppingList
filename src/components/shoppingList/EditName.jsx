// src/components/shoppingList/EditName.jsx
import { useState } from "react"
import PropTypes from "prop-types"
import { actionTypes } from "../../context/ReducerHelper"

export function EditName({ name, dispatch, shopListId }) {
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(name)

  const handleEditClick = (e) => {
    e.stopPropagation()
    setIsEditing(true)
    setNewName(name)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setNewName(value)
  }

  const handleSubmit = (e) => {
    e.stopPropagation()

    const trimmed = newName.trim()

    if (!trimmed) {
      return
    }

    dispatch({
      type: actionTypes.renameList,
      payload: { listId: shopListId, newName: trimmed },
    })

    setIsEditing(false)
  }

  // HANDLE CANCEL
  const handleCancel = (e) => {
    e.stopPropagation()
    setIsEditing(false)
    setNewName(name)
  }

  // OWNER VIEW
  return (
    <div>
      {isEditing ? (
        <form className="flex gap-4">
          <input
            type="text"
            value={newName}
            onChange={handleInputChange}
            placeholder="Nový název"
            required
            autoFocus
          />
          <button type="submit" onClick={handleSubmit}>
            💾
          </button>
          <button type="button" onClick={handleCancel}>
            ❌
          </button>
        </form>
      ) : (
        <div className="flex gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>

          {/* TODO: replace with pen icon */}
          <button onClick={handleEditClick}>✏️</button>
        </div>
      )}
    </div>
  )
}

EditName.propTypes = {
  name: PropTypes.string.isRequired,
  ownerId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
}
