let selectedIngredients = [];

const ingredienticons = {
    reis: "🍚",
    tomate: "🍅",
    tomaten: "🍅",
    zwiebel: "🧅",
    "öl": "🫒",
    ei: "🥚",
    "käse": "🧀",
    milch: "🥛",
    butter: "🧈",
    spaghetti: "🍝",
    hackfleisch: "🥩",
    "hähnchen": "🍗",
    wrap: "🌯",
    salat: "🥗",
    mehl: "🌾",
    zucker: "🍬",
    brot: "🍞",
    teig: "🥐",
    basilikum: "🌿",
    burgerbrot: "🍔"
};

function iconFor(name) {
    return ingredienticons[(name || "").toLowerCase()] || "🥄";
}

function capitalize(s) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatIngredient(name) {
    return `${iconFor(name)} ${capitalize(name)}`;
}

// Zutat hinzufügen aus dem Input-Feld
window.addIngredient = function () {
    const inputEl = document.getElementById("input");
    const value = inputEl.value.trim().toLowerCase();

    if (!value) return;

    if (!selectedIngredients.includes(value)) {
        selectedIngredients.push(value);
        renderSelectedIngredients();
    }

    inputEl.value = "";
    inputEl.focus();
};

// Zutat per Klick (z.B. aus Schnellauswahl) hinzufügen
function addIngredientByName(name) {
    const value = name.trim().toLowerCase();
    if (!value) return;
    if (selectedIngredients.includes(value)) return; //Keine doppeleintragung
    selectedIngredients.push(value);
    renderSelectedIngredients();
}

function renderSelectedIngredients() {
    const container = document.getElementById("selectedIngredients");
    container.innerHTML = "";

    selectedIngredients.forEach(ingredient => {
        const chip = document.createElement("span");
        chip.classList.add("chip");
        chip.textContent = formatIngredient(ingredient);
        chip.title = "Entfernen";

        chip.addEventListener("click", () => {
            selectedIngredients = selectedIngredients.filter(i => i !== ingredient);
            renderSelectedIngredients();
        });

        container.appendChild(chip);
    });
}

// Suchfunktion
window.search = async function () {

    if (selectedIngredients.length === 0) {
        alert("Bitte zuerst mindestens eine Zutat hinzufügen!");
        return;
    }

    const res = await fetch("http://localhost:3000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: selectedIngredients })
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

async function loadTopIngredients() {
    const res = await fetch("http://localhost:3000/top-ingredients");
    const data = await res.json();
    const list = document.getElementById("topIngredients");
    list.innerHTML = "";

    data.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${formatIngredient(item[0])} (${item[1]})`;
        li.title = "Zur Auswahl hinzufügen";
        li.addEventListener("click", () => addIngredientByName(item[0]));
        list.appendChild(li);
    });

    const quickSelect = document.getElementById("quickSelect");
    quickSelect.innerHTML = "";

    data.forEach(item => {
        const chip = document.createElement("span");
        chip.classList.add("quick-chip");
        chip.textContent = formatIngredient(item[0]);
        chip.addEventListener("click", () => addIngredientByName(item[0]));
        quickSelect.appendChild(chip);
    });
}

// Rezept öffnen
function openRecipe(recipe) {

    const modal = document.getElementById("recipeViewModal");
    const content = document.getElementById("recipeViewContent");

    const alreadySaved = isInLibrary(recipe);

    content.innerHTML = `
        <h1>${recipe.name}</h1>

        <h3>Zutaten:</h3>

        <ul>
            ${recipe.ingredients.map(i => `
                <li>${formatIngredient(i)}</li>
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

<button id="libraryBtn" class="library-btn">
    ${alreadySaved ? "Aus Bibliothek löschen" : "Zur Bibliothek hinzufügen"}
</button>
`;

    modal.style.display = "flex";

    const libraryBtn = document.getElementById("libraryBtn");

    // Rezept speichern oder entfernen
    libraryBtn.addEventListener("click", () => {
        if (isInLibrary(recipe)) {
            removeFromLibrary(recipe);
        } else {
            addToLibrary(recipe);
        }
    });
}

// Library laden / speichern (localStorage)

function getLibrary() {
    try {
        return JSON.parse(localStorage.getItem("rezepte")) || [];
    } catch (e) {
        return [];
    }
}

function saveLibrary(library) {
    localStorage.setItem("rezepte", JSON.stringify(library));
}

function isInLibrary(recipe) {
    return getLibrary().some(r => r.id === recipe.id);
}

function loadLibrary() {
    const library = getLibrary();
    const list = document.getElementById("libraryList");

    if (library.length === 0) {
        list.innerHTML = `<p>Noch keine Rezepte gespeichert</p>`;
        return;
    }

    list.innerHTML = "";
    library.forEach(recipe => renderLibraryItem(recipe));
}

function renderLibraryItem(recipe) {
    const list = document.getElementById("libraryList");

    const item = document.createElement("div");
    item.classList.add("library-item");
    item.textContent = `🍽️ ${recipe.name}`;
    item.title = "Rezept öffnen";

    item.addEventListener("click", () => openRecipe(recipe));

    list.appendChild(item);
}

function addToLibrary(recipe) {

    const library = getLibrary();

    if (library.some(r => r.id === recipe.id)) {
        closeRecipeModal();
        closeModal();
        return;
    }

    library.push(recipe);
    saveLibrary(library);

    const list = document.getElementById("libraryList");
    if (list.innerHTML.includes("Noch keine")) {
        list.innerHTML = "";
    }
    renderLibraryItem(recipe);

    closeRecipeModal();
    closeModal();
}

function removeFromLibrary(recipe) {

    const library = getLibrary().filter(r => r.id !== recipe.id);
    saveLibrary(library);

    loadLibrary();

    closeRecipeModal();
    closeModal();
}

function closeRecipeModal() {
    document.getElementById("recipeViewModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    loadLibrary();
    loadTopIngredients();

    const inputEl = document.getElementById("input");
    inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            window.addIngredient();
        }
    });
});