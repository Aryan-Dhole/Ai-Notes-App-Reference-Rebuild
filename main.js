let notes = []

const titleInput = document.getElementById("noteTitle")
const contentInput = document.getElementById("noteContent")
const tagsInput = document.getElementById("noteTags")
const searchInput = document.getElementById("searchInput")


document.addEventListener("DOMContentLoaded", () => {
    notes = loadNotes()

    const savedQuery = loadSearchQuery();
    if (savedQuery) {
        searchInput.value = savedQuery;
        handleSearch(savedQuery);
    } else {
        renderNotes();
    }

    document.getElementById("addNoteBtn").addEventListener("click", () => {
        const title = titleInput.value.trim()
        const content = contentInput.value.trim()
        const tags = tagsInput.value.trim().split(",").map(t => t.trim()).filter(Boolean)

        if (!title || !content) return

        const note = {
            title,
            content,
            tags,
            date: new Date().toLocaleString(),
            summary: ""
        }

        notes.push(note)
        saveNotes(notes)
        renderNotes()

        titleInput.value = "";
        contentInput.value = "";
        tagsInput.value = "";
    })

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase()
        saveSearchQuery(query);

        if (!query) {
            renderNotes()
            return;
        }
        handleSearch(query)
    })

    function handleSearch(query) {
        const filtered = notes.filter(note => {
            const titleMatch = note.title.toLowerCase().includes(query)
            const tagMatch = Array.isArray(note.tags) && note.tags.some(tag => tag.toLowerCase().includes(query))
            return titleMatch || tagMatch
        })
        renderFilteredNotes(filtered)
    }


})