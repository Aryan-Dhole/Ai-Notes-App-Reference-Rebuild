function escapeHtml(text) {
    if (text === undefined || text === null) return "";
    text = String(text);  // ✅ force to string

    const map = {
        '&': "&amp;",
        '<': "&lt;",
        '>': "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function typeWriter(element, text, speed = 30) {
    element.textContent = ""
    let i = 0

    function typing() {
        if (i < text.length) {
            element.textContent += text.charAt(i)
            i++
            setTimeout(typing, speed)
        }
    }
    typing()
}

function loadingSpinner() {
    return `<div class="spinner-border spinner-border-sm text-info" role="status"></div>`;
}