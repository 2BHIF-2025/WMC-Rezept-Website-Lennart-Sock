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

        card.addEventListener("click", () => {
            openRecipe(recipe);
        });

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

// Rezept öffnen
function openRecipe(recipe) {

    const modal = document.getElementById("recipeViewModal");
    const content = document.getElementById("recipeViewContent");

    content.innerHTML = `
        <h1>${recipe.name}</h1>

        <h3>Zutaten:</h3>

        <ul>
            ${recipe.ingredients.map(i => `
                <li>${i}</li>
            `).join("")}
        </ul>

        <h3>Schritt für Schritt:</h3>

        <div class="steps-container">

            ${recipe.steps.map((step, index) => `

                <div class="step-card">

                    <input type="checkbox" class="step-checkbox">

                    <div>
                        <h4>Schritt ${index + 1}</h4>
                        <p>${step}</p>
                    </div>

                </div>

            `).join("")}

        </div>

<button id="libraryBtn" class="library-btn" style="display:none;">
    Zur Bibliothek hinzufügen
</button>
`;

    modal.style.display = "flex";
    const checkboxes = document.querySelectorAll(".step-checkbox");
    const libraryBtn = document.getElementById("libraryBtn");

    checkboxes.forEach(box => {

        box.addEventListener("change", () => {

            const allChecked = [...checkboxes].every(c => c.checked);

            if (allChecked) {
                libraryBtn.style.display = "block";
            } else {
                libraryBtn.style.display = "none";
            }
        });
    });

    // Rezept speichern
    libraryBtn.addEventListener("click", () => {
        addToLibrary(recipe);
    });
}

function addToLibrary(recipe) {

    const library = document.getElementById("libraryList");

    // Placeholder entfernen
    if (library.innerHTML.includes("Noch keine")) {
        library.innerHTML = "";
    }

    const item = document.createElement("div");
    item.classList.add("library-item");

    item.innerHTML = `
        🍽️ ${recipe.name}
    `;

    library.appendChild(item);
}

function closeRecipeModal() {
    document.getElementById("recipeViewModal").style.display = "none";
}

loadTopIngredients();