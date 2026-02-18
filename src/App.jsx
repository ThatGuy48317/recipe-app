import { useState, useEffect } from 'react';

// --- RECIPE CARD COMPONENT ---
// We define this helper component right here so you don't have to worry about imports.
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

// --- MAIN APP COMPONENT ---
function App() {
  const [recipes, setRecipes] = useState([]);

  // New State: These hold the values of our input boxes
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");

  // 1. Fetch data on load
  useEffect(() => {
    fetch('http://127.0.0.1:8000/recipes')
      .then(response => response.json())
      .then(data => setRecipes(data))
      .catch(error => console.error("Error:", error));
  }, []);

  // 2. Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Stop the page from refreshing

    const newRecipe = { name, ingredients };

    // Send data to Python
    fetch('http://127.0.0.1:8000/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecipe)
    })
      .then(response => response.json())
      .then(data => {
        // Add the new recipe to our list immediately
        setRecipes([...recipes, data]);
        // Clear the input boxes
        setName("");
        setIngredients("");
      })
      .catch(error => console.error("Error adding recipe:", error));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>My Recipe App</h1>

      {/* --- NEW FORM SECTION --- */}
      <div style={{ background: "#f0f0f0", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>Add New Recipe</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Recipe Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            style={{ padding: "8px 16px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Add Recipe
          </button>
        </form>
      </div>

      {/* --- RECIPE LIST --- */}
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