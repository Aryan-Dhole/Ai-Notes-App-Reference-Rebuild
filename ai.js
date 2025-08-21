const API_URL = "https://openrouter.ai/api/v1/chat/completions"

const API_KEY = "YOUR_KEY_HERE"

async function generateSummary(content, isRegenerate = false) {

    try {
        const prompt = isRegenerate
            ? `summarize this not in one clear sentence. Rephrase differently than before, use synonyms or new structure:\n\n${content}`
            : `summarize this note in one sentence:\n\n${content}`;

        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: isRegenerate ? 0.7 : 0.5,
                seed: isRegenerate ? Date.now() : undefined
            })
        })

        if (!res.ok) {
            throw new Error(`API response failed: ${res.status}`)
        }

        const data = await res.json()
        const summary = data.choices[0].message.content.trim();

        return summary;
    } catch (err) {
        console.error("Error generating summary:", err);
        return "⚠️ Failed to generate summary. Please try again.";
    }


}