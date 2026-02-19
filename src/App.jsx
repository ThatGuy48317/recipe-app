import { useState, useEffect } from 'react';

function RecipeCard(props) {
  const [likes, setLikes] = useState(0);

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px", borderRadius: "8px" }}>
      <h2>{props.name}</h2>
      <p><strong>Ingredients:</strong></p>
      <p>{props.ingredients}</p>
      <hr />
      <button onClick={() => setLikes(likes + 1)}>
        👍 Like ({likes})
      </button>
    </div>
  );
}

function App() {
  const [recipes, setRecipes] = useState([]);
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");

  // Pointing to your live Azure Backend URL
  const API_URL = "https://recipe-api-48317.azurewebsites.net";

  useEffect(() => {
    fetch(`${API_URL}/recipes`)
      .then(response => response.json())
      .then(data => setRecipes(data))
      .catch(error => console.error("Error:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Create a temporary fake ID (using the current time)
    const tempId = Date.now();
    const tempRecipe = { id: tempId, name, ingredients };

    // 2. Optimistic Update: Put it on the screen right now!
    setRecipes([...recipes, tempRecipe]);

    // 3. Clear the text boxes right away
    setName("");
    setIngredients("");

    // 4. Send the real data to Azure in the background
    const newRecipeData = { name: tempRecipe.name, ingredients: tempRecipe.ingredients };

    fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecipeData)
    })
      .then(response => response.json())
      .then(realRecipe => {
        // 5. Swap the temporary recipe with the real one from Azure
        setRecipes(currentRecipes =>
          currentRecipes.map(recipe => recipe.id === tempId ? realRecipe : recipe)
        );
      })
      .catch(error => {
        console.error("Error adding recipe:", error);
        // If the save fails, remove the temporary recipe from the screen
        setRecipes(currentRecipes => currentRecipes.filter(recipe => recipe.id !== tempId));
      });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>My Recipe App</h1>

      <div style={{ background: "#f0f0f0", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>Add New Recipe</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Recipe Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            required
          />
          <input
            type="text"
            placeholder="Ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            required
          />
          <button
            type="submit"
            style={{ padding: "8px 16px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Add Recipe
          </button>
        </form>
      </div>

      <div>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            name={recipe.name}
            ingredients={recipe.ingredients}
          />
        ))}
      </div>
    </div>
  )
}

export default App