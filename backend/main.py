from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# --- CORS CONFIGURATION ---
# This tells the server: "Trust requests coming from these addresses"
origins = [
    "http://localhost:5173",    # The default Vite/React port
    "http://127.0.0.1:5173",    # Sometimes localhost is 127.0.0.1
    "https://proud-beach-0b18d850f.4.azurestaticapps.net",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # List of allowed sites
    allow_credentials=True,
    allow_methods=["*"],        # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],        # Allow all headers
)

# --- DATA MODELS ---
# Pydantic tells FastAPI what data to expect.
# We don't include 'id' here because the server assigns that automatically.
class RecipeSchema(BaseModel):
    name: str
    ingredients: str

# --- MOCK DATABASE ---
RECIPES = [
    {
        "id": 1, 
        "name": "Smoked Brisket", 
        "ingredients": "Brisket, Salt, Pepper, Wood Smoke"
    },
    {
        "id": 2, 
        "name": "Pasta Carbonara", 
        "ingredients": "Pasta, Eggs, Cheese, Bacon"
    },
    {
        "id": 3, 
        "name": "Tacos", 
        "ingredients": "Beef, Shells, Cheese, Lettuce"
    }
]

@app.get("/")
def read_root():
    return {"message": "Hello from Python!"}

# 1. Get ALL recipes
@app.get("/recipes")
def get_recipes():
    return RECIPES

# 2. Get a SINGLE recipe by ID
@app.get("/recipes/{recipe_id}")
def get_recipe(recipe_id: int):
    for recipe in RECIPES:
        if recipe["id"] == recipe_id:
            return recipe
    return {"error": "Recipe not found"}

# 3. Create a NEW recipe (POST)
@app.post("/recipes")
def create_recipe(new_recipe: RecipeSchema):
    # 1. Calculate a new ID (current length + 1)
    new_id = len(RECIPES) + 1
    
    # 2. Convert the data they sent us into a dictionary
    recipe_dict = new_recipe.model_dump()
    
    # 3. Add the ID to the dictionary
    recipe_dict["id"] = new_id
    
    # 4. Save it to our list
    RECIPES.append(recipe_dict)
    
    # 5. Return the new recipe so the user knows it worked
    return recipe_dict