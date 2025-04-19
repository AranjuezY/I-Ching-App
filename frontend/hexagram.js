export async function fetchHexagram(name) {
    try {
        const res = await fetch(`http://localhost:5000/api/hexagram/${encodeURIComponent(name)}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error('Error fetching hexagram:', error);
        return null;
    }
}

export function renderHexagram(containerId, binary, name) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (!container || !binary) return;

    if (name) {
        const nameEl = document.createElement('h1');
        nameEl.textContent = name;
        container.appendChild(nameEl);
    }

    for (let i = 5; i >= 0; i--) {
        const div = document.createElement('div');
        div.className = 'yao-line ' + (binary[i] === '1' ? 'solid' : 'broken');
        container.appendChild(div);
    }
}

export function renderTexts(texts) {
    const div = document.getElementById("texts");
    if (!div) return;

    div.innerHTML = '';
    if (texts && Array.isArray(texts)) {
        texts.forEach(text => {
            const p = document.createElement('p');
            p.textContent = text;
            div.appendChild(p);
        });
    }
}

export async function displayHexagram(name) {
    try {
        const data = await fetchHexagram(name);
        if (!data) return;

        // Main hexagram
        renderHexagram("main-hexagram", data.binary, data.name);
        renderTexts([...(data.guaci || []), ...(data.yaoci || [])]);

        // Related hexagrams
        if (data.relations) {
            renderHexagram("mutual-hexagram", data.relations.mutual.binary, data.relations.mutual.name);
            renderHexagram("reverse-hexagram", data.relations.reverse.binary, data.relations.reverse.name);
            renderHexagram("inverse-hexagram", data.relations.inverse.binary, data.relations.inverse.name);
        }
    } catch (error) {
        console.error('Error displaying hexagram:', error);
    }
}
