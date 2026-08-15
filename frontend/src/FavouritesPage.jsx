import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function FavoritesPage() {
  const [favorites, setFavorites] = useState([])

  // Tracks which recipe IDs are currently checked
  const [selectedIds, setSelectedIds] = useState([])

  // Holds the merged shopping list once generated
  const [shoppingList, setShoppingList] = useState([])

  const [message, setMessage] = useState(null)

  // Runs once when this page loads, fetching the current list of saved recipes
  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/favorites/')
      const data = await response.json()
      setFavorites(data)
    } catch (error){
        setMessage({ text: 'Could not load favorites! --- check your connection.', type: 'error' })

    }
  }

  const handleRemove = async (id) => {
    try{
      await fetch(`http://localhost:8000/api/favorites/${id}/`, {
        method: 'DELETE'
      })
      fetchFavorites()   // refresh the list after removing
    } catch(error){
         setMessage({ text: 'Could not remove recipe! --- try again.', type: 'error' })
    }
  }

  // Toggles a recipe's checkbox on/off
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // Combines ingredients from all selected recipes into one deduplicated list
  const generateShoppingList = () => {
    const selectedRecipes = favorites.filter((recipe) => selectedIds.includes(recipe.id))

    const combined = {} 

    selectedRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ing) => {
        combined[ing.name] = true
      })
    })

    setShoppingList(Object.keys(combined))   //unique ingredient names
  }

  return (
    <div>
      <h1>My Favorites</h1>
      {message && (
        <div className={`toast toast-${message.type}`}>
          {message.text}
        </div>
      )}
      {favorites.length === 0 ? (
        <p className="empty-state">No favorites yet :(</p>
      ) : (
      favorites.map((recipe) => (
        <div key={recipe.id} className="recipe-card">
          <input
            type="checkbox"
            checked={selectedIds.includes(recipe.id)}
            onChange={() => toggleSelect(recipe.id)}
          />
          <img src={recipe.image} alt={recipe.name} width="100" />
          <Link to={`/recipe/${recipe.meal_id}`}>{recipe.name}</Link>
          <button onClick={() => handleRemove(recipe.id)}>Remove</button>
        </div>
      )))}

      <button onClick={generateShoppingList}>Generate Shopping List</button>

      {shoppingList.length > 0 && (
        <div>
          <h2>Shopping List</h2>
          <ul>
            {shoppingList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default FavoritesPage