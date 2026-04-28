const express = require("express");
const app = express();
const recipes = require("./recipes.json");
const path = require("path");

app.use(express.json());
app.use(express.static("public"));

//Zutaten vom User in rezept umwandeln und zurückgeben, sortiert nach Anzahl der Treffer
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

// Server starten
app.listen(3000, () => {
    console.log("Server läuft auf http://localhost:3000");
});

// HTML zurückgeben
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"index.html"));
});

//CSS zurückgeben
app.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname,"style.css"));
});

//JS zurückgeben
app.get("/script.js", (req, res) => {
    res.sendFile(path.join(__dirname,"script.js"));
});

//get top 5 ingredients with count and return as json
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