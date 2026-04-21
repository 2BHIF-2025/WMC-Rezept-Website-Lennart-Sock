const express = require("express");
const app = express();
const recipes = require("./recipes.json");
const path = require("path");

app.use(express.json());
app.use(express.static("public"));

app.post("/search", (req, res) => {
    const userIngredients = req.body.ingredients.map(i => i.toLowerCase());

    const results = recipes.map(recipe => {
        const matches = recipe.ingredients.filter(i =>
            userIngredients.includes(i)
        );

        return {
            ...recipe,
            matchCount: matches.length
        };
    })
        .filter(r => r.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount);

    res.json(results);
});

app.listen(3000, () => {
    console.log("Server läuft auf http://localhost:3000");
});

app.get("/top-ingredients", (req, res) => {
    const count = {};

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(i => {
            count[i] = (count[i] || 0) + 1;
        });
    });

    const sorted = Object.entries(count)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    res.json(sorted);
});