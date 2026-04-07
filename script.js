window.search = async function () {
    const input = document.getElementById("input").value;
    const ingredients = input.split(",").map(i => i.trim());

    const res = await fetch("http://localhost:3000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients })
    });
}