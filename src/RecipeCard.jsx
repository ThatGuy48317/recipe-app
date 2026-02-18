import { useState } from 'react';

function RecipeCard(props) {
    // 1. We create a piece of state called "likes".
    // 2. "setLikes" is the function we use to change it.
    // 3. We start at 0.
    const [likes, setLikes] = useState(0);

    return (
        <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px", borderRadius: "8px" }}>
            <h2>{props.name}</h2>
            <p><strong>Ingredients:</strong></p>
            <p>{props.ingredients}</p>

            <hr />

            {/* When clicked, we tell React to update the state */}
            <button onClick={() => setLikes(likes + 1)}>
                👍 Like ({likes})
            </button>
        </div>
    );
}

export default RecipeCard;