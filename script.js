// Suchfunktion
window.search = async function () {

    const input = document.getElementById("input").value;
    const ingredients = input.split(",").map(i => i.trim());

    const res = await fetch("http://localhost:3000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients })
    });

    const data = await res.json();

    const modal = document.getElementById("recipeModal");
    const modalResults = document.getElementById("modalResults");

    modalResults.innerHTML = "";

    if (data.length === 0) {
        modalResults.innerHTML = `
            <p>Keine Rezepte gefunden 😢</p>
        `;
    }

    data.forEach(recipe => {

        const card = document.createElement("div");
        card.classList.add("recipe-card");

        card.innerHTML = `
            <h2>${recipe.name}</h2>

            <p>
                ${recipe.matchCount} passende Zutaten
            </p>

            <button class="choose-btn">
                Rezept auswählen
            </button>
        `;

        modalResults.appendChild(card);
    });

    modal.style.display = "flex";
};

function closeModal() {
    document.getElementById("recipeModal").style.display = "none";
}

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