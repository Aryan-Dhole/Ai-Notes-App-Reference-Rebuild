function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes))
}

function loadNotes() {
    const stored = localStorage.getItem("notes")
    return stored ? JSON.parse(stored) : []
}

function saveSearchQuery(query) {
    localStorage.setItem("searchQuery", query);
}

// Load search query from localStorage
function loadSearchQuery() {
    return localStorage.getItem("searchQuery") || "";
}

