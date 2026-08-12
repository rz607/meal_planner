import { useState, useEffect } from 'react'

function FavoritesPage() {
  const [favorites, setFavorites] = useState([])

  // Runs once when this page loads, fetching the current list of saved recipes
  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    const response = await fetch('http://localhost:8000/api/favorites/')
    const data = await response.json()
    setFavorites(data)
  }

  const handleRemove = async (id) => {
    await fetch(`http://localhost:8000/api/favorites/${id}/`, {
      method: 'DELETE'
    })
    fetchFavorites()   // refresh the list after removing
  }

  return (
    <div>
      <h1>My Favorites</h1>
      {favorites.map((recipe) => (
        <div key={recipe.id}>
          <img src={recipe.image} alt={recipe.name} width="100" />
          <p>{recipe.name}</p>
          <button onClick={() => handleRemove(recipe.id)}>Remove</button>
        </div>
      ))}
    </div>
  )
}

export default FavoritesPage