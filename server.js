const express = require("express");
const path = require("path");
const recipes = require("./recipes.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post("/search", (req, res) => {
    const userIngredients = Array.isArray(req.body.ingredients)
        ? req.body.ingredients.map(ingredient => ingredient.toLowerCase())
        : [];

    const results = recipes
        .map(recipe => {
            const matches = recipe.ingredients.filter(ingredient =>
                userIngredients.includes(ingredient.toLowerCase())
            );

            return {
                ...recipe,
                matchCount: matches.length
            };
        })
        .filter(recipe => recipe.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount);

    res.json(results);
});

app.get("/top-ingredients", (req, res) => {
    const ingredientCounts = {};

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            ingredientCounts[ingredient] = (ingredientCounts[ingredient] || 0) + 1;
        });
    });

    const topIngredients = Object.entries(ingredientCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    res.json(topIngredients);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server laeuft auf http://localhost:${PORT}`);
});
