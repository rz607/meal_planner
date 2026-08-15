import { useState } from 'react'
import { Link } from 'react-router-dom'

function SearchPage() {

  const [hasSearched, setHasSearched] = useState(false) //track if search has actually run yet
  
  // Holds whatever the user types in the search box
  const [query, setQuery] = useState('')

  // Holds the list of results returned from Django
  const [results, setResults] = useState([])

  const [message, setMessage] = useState(null) //mesaage shown after savind

  // Runs when the user submits the search form
  const handleSearch = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`http://localhost:8000/api/search/?q=${query}`)
      const data = await response.json()
      setResults(data)
      setHasSearched(true)
    } catch (error) {
      // fetch throws if the network request fails 
      setMessage({ text: 'Something went wrong :( --- please try again.', type: 'error' })
    }
  }

  const handleSave = async (recipe) => {
    // First, fetch full details (including real ingredients) using the recipe's id
    try{
      const detailResponse = await fetch(`http://localhost:8000/api/recipe/${recipe.id}/`)
      const detail = await detailResponse.json()

      //  saves using the real ingredients, not an empty placeholder
      const response = await fetch('http://localhost:8000/api/favorites/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meal_id: recipe.id,
          name: recipe.name,
          image: recipe.image,
          ingredients: detail.ingredients   // real data now
        })
      })
      if (response.status === 201) {
        setMessage({ text: `${recipe.name} saved!`, type: 'success' })
      } else {
        setMessage({ text: `${recipe.name} is already in your favorites.`, type: 'error' })
      }
    } catch (error) {
    setMessage({ text: 'Could not save recipe :( --— please try again.', type: 'error' })
  }


      setTimeout(() => setMessage(null), 3000) //clear message after 3s
    }


  return (
    <div>
      <h1>Meal Planner</h1>
      {message && (
        <div className={`toast toast-${message.type}`}>
          {message.text}
        </div>
      )}

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
        {hasSearched && results.length === 0 ? ( //show error message after a search 
          <p className="empty-state">No recipes found :( </p>
        ) : (
          results.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image} alt={recipe.name} width="100" />
              <Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
              <button onClick={() => handleSave(recipe)}>Save to Favorites</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SearchPage
