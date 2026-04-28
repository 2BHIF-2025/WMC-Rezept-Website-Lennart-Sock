//Suchfunktion
window.search = async function () {
    const input = document.getElementById("input").value;
    const ingredients = input.split(",").map(i => i.trim());

    // Anfrage an server senden
    const res = await fetch("http://localhost:3000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients })
    });

    // Ergebnisse erhalten
    const data = await res.json();
    const list = document.getElementById("results");
    list.innerHTML = "";

    // Ergebnisse anzeigen
    data.forEach(recipe => {
        const li = document.createElement("li");
        li.textContent = recipe.name + " (" + recipe.matchCount + " Treffer)";
        list.appendChild(li);
    });
};

// Funktion zum laden der top zutaten
async function loadTopIngredients() {
    const res = await fetch("http://localhost:3000/top-ingredients");
    const data = await res.json();

    const list = document.getElementById("topIngredients");
    list.innerHTML = "";

    // Zutaten anzeigen
    data.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item[0] + " (" + item[1] + ")";
        list.appendChild(li);
    });
}

loadTopIngredients();