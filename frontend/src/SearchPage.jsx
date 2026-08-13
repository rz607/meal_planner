import { useState } from 'react'
import { Link } from 'react-router-dom'

function SearchPage() {
  // Holds whatever the user types in the search box
  const [query, setQuery] = useState('')

  // Holds the list of results returned from Django
  const [results, setResults] = useState([])

  // Runs when the user submits the search form
  const handleSearch = async (e) => {
    e.preventDefault()   // stop page from reloading 

    const response = await fetch(`http://localhost:8000/api/search/?q=${query}`)
    const data = await response.json()
    setResults(data)
  }

  const handleSave = async (recipe) => {
  // First, fetch full details (including real ingredients) using the recipe's id
  const detailResponse = await fetch(`http://localhost:8000/api/recipe/${recipe.id}/`)
  const detail = await detailResponse.json()

  //  saves using the real ingredients, not an empty placeholder
  await fetch('http://localhost:8000/api/favorites/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      meal_id: recipe.id,
      name: recipe.name,
      image: recipe.image,
      ingredients: detail.ingredients   // real data now
    })
  })
  alert(`${recipe.name} saved!`)
  }
  

  return (
    <div>
      <h1>Meal Planner</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a recipe..."
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {results.map((recipe) => (
          <div key={recipe.id}>
            <img src={recipe.image} alt={recipe.name} width="100" />
            <Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
            <button onClick={() => handleSave(recipe)}>Save to Favorites</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchPage
