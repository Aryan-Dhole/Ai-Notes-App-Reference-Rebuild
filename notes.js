function renderNotes() {
    renderNotesList(notes, (_, i) => i)
}

// Render filtered notes (search results)
function renderFilteredNotes(filteredNotes) {
    renderNotesList(filteredNotes, (note) => {
        const foundIndex = notes.indexOf(note);
        if (foundIndex !== -1) return foundIndex;
        return notes.findIndex(n =>
            n.title === note.title &&
            n.content === note.content &&
            n.date === note.date
        );
    });
}

function renderNotesList(notes, getIndex) {
    const container = document.getElementById("notesContainer")
    container.innerHTML = "";

    notes.forEach((note, i) => {
        const indx = getIndex(note, i)

        const tagsHtml = (note.tags && note.tags.length)
            ? note.tags.map(tag => `<span class="badge bg-success me-1">${escapeHtml(tag)}</span>`).join("")
            : `<small class="text-muted">No tags</small>`

        const summaryHtml = note.summary
            ? `<p class="summary-text text-info mt-2">${escapeHtml(note.summary)}</p>
        <button class="btn btn-sm btn-outline-secondary copy-btn mt-2" data-index"${indx}">Copy</button>
        <button class="btn btn-sm btn-warning regenerate-btn mt-2" data-index="${indx}">Regenerate</button>`
            : "";

        const noteCard = document.createElement("div")
        noteCard.className = "col-md-4 mb-3"
        noteCard.innerHTML = `
        <div class="card h-100">
            <div class="card-body">
            <h5 class="card-title">${escapeHtml(note.title)}</h5>
            <h6 class="card-subtitle">${tagsHtml}</h6>
            <p class= "card-text">${escapeHtml(note.content)}</p>
            <div class="summary-container">${summaryHtml}</div>
        </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
                <small class="text-muted">${note.date}</small>
                <div>
                    <button class="btn btn-sm btn-secondary edit-btn me-1" data-index="${indx}">Edit</button>
                    <button class="btn btn-sm btn-info summarize-btn me-1" data-index="${indx}">Summarize</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-index="${indx}">Delete</button>
                </div>
            </div>
        </div>`

        container.appendChild(noteCard)
    });
    attachNoteHandlers()
}


function attachNoteHandlers() {

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const indx = Number(e.currentTarget.dataset.index)
            if (isNaN(indx) || indx < 0) return;
            notes.splice(indx, 1)
            saveNotes(notes)
            renderNotes()
        })
    })


    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {

            const indx = Number(e.currentTarget.dataset.index)
            if (isNaN(indx) || indx < 0) return;

            const note = notes[indx]
            const cardBody = e.currentTarget.closest(".card").querySelector(".card-body")

            cardBody.innerHTML = `
            <input class="form-control mb-2 edit-title" value="${escapeHtml(note.title)}" />
            <input class="form-control mb-2 edit-tags" value="${note.tags ? note.tags.join(", ") : ""}"  />
            <textarea class="form-control mb-2 edit-content">${escapeHtml(note.content)}</textarea>
            <button class="btn btn-sm btn-success save-edit" data-index="${indx}">Save</button>
            <button class="btn btn-sm btn-secondary cancel-edit">Cancel</button>`


            const contentInput = cardBody.querySelector(".edit-content");

            // Initial auto-resize
            contentInput.style.height = "auto";
            contentInput.style.height = contentInput.scrollHeight + "px";

            // Then resize on typing
            contentInput.addEventListener("input", () => {
                contentInput.style.height = "auto";
                contentInput.style.height = contentInput.scrollHeight + "px";
            });



            cardBody.querySelector(".save-edit").addEventListener("click", () => {
                const newTitle = cardBody.querySelector(".edit-title").value.trim()
                const newContent = cardBody.querySelector(".edit-content").value.trim()
                const newTags = cardBody.querySelector(".edit-tags").value.trim().split(",").map(t => t.trim()).filter(Boolean)

                notes[indx].title = newTitle
                notes[indx].content = newContent
                notes[indx].tags = newTags

                saveNotes(notes)
                renderNotes()
            })
            document.querySelector(".cancel-edit").addEventListener("click", () => {
                renderNotes()
            })

        })
    })



    // Summarize
    document.querySelectorAll(".summarize-btn").forEach(btn => {
        btn.addEventListener("click", async e => {
            const idx = Number(e.currentTarget.dataset.index);
            if (isNaN(idx) || idx < 0) return;

            const container = e.currentTarget.closest(".card").querySelector(".summary-container");

            // Find or create summary text element
            let summaryEl = container.querySelector(".summary-text");
            if (!summaryEl) {
                summaryEl = document.createElement("p");
                summaryEl.className = "summary-text text-info mt-2";
                container.prepend(summaryEl); // insert above buttons
            }

            summaryEl.innerHTML = loadingSpinner(); // show spinner

            const summary = await generateSummary(notes[idx].content, false);
            notes[idx].summary = summary;
            saveNotes(notes);

            // clear spinner and typewriter into the summary element
            summaryEl.innerHTML = "";
            typeWriter(summaryEl, summary, 30);


        });
    });


    document.querySelectorAll(".regenerate-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {

            const indx = Number(e.currentTarget.dataset.index)
            if (isNaN(indx) || indx < 0) return;

            const container = e.currentTarget.closest(".card").querySelector(".summary-container")

            let summaryEl = container.querySelector(".summary-text");

            if (!summaryEl) {
                summaryEl = document.createElement("p")
                summaryEl.className = "summary-text text-info mt-2"
                container.prepend(summaryEl)
            }
            summaryEl.innerHTML = loadingSpinner();

            const summary = await generateSummary(notes[indx].content, true)
            notes[indx].summary = summary

            saveNotes(notes)

            summaryEl.innerHTML = "";
            typeWriter(summaryEl, summary, 30);



        })
    })

    document.querySelectorAll(".copy-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const summaryEl = e.currentTarget.closest(".card").querySelector(".summary-text");
            const summaryText = summaryEl ? summaryEl.textContent : "";

            navigator.clipboard.writeText(summaryText).then(() => {
                btn.textContent = "Copied!";
                btn.disabled = true;
                setTimeout(() => {
                    btn.textContent = "Copy";
                    btn.disabled = false;
                }, 1500);
            });
        });
    });



}





