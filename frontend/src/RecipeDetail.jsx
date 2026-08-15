import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function RecipeDetail() {
  // read dynamic part of the URL (
  const { id } = useParams()

  const [recipe, setRecipe] = useState(null)

  const [error, setError] = useState(false) 

  useEffect(() => {
    fetchRecipe()
  }, [id])   // re-runs if the id in the URL changes

  const fetchRecipe = async () => {
    try{
      const response = await fetch(`http://localhost:8000/api/recipe/${id}/`)
      const data = await response.json()
      setRecipe(data)
    } catch(error){
        setError(true)
    }
  }

  //avoid getting stuck on loadding if fetch does fail
  if (error) {
  return <p className="empty-state">Could not load this recipe --- Please go back and try again.</p>
  }


  // Show a loading state while the fetch is in progress
  if (!recipe) {
    return <p>Loading...</p>
  }

  return (
    <div className="recipe-detail">
      <h1>{recipe.name}</h1>
      <img src={recipe.image} alt={recipe.name} width="200" />

      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ing, index) => (
          <li key={index}>{ing.measure} {ing.name}</li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <p>{recipe.instructions}</p>
    </div>
  )
}

export default RecipeDetail