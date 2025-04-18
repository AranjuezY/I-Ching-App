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

export function renderHexagram(containerId, binary) {
    const container = document.getElementById(containerId);
    if (!container || !binary) return;

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
        const main = document.getElementById("main-hexagram");
        const div_main = document.createElement('h1');
        div_main.innerHTML = data.name;
        main.append(div_main);
        renderHexagram("main-hexagram", data.binary);
        renderTexts([...(data.guaci || []), ...(data.yaoci || [])]);

        // Related hexagrams
        if (data.relations) {
            const mutual = document.getElementById("mutual-hexagram");
            const div_mutual = document.createElement('h1');
            div_mutual.innerHTML = data.relations.mutual.name;
            mutual.append(div_mutual);
            renderHexagram("mutual-hexagram", data.relations.mutual.binary);
            
            const reverse = document.getElementById("reverse-hexagram");
            const div_reverse = document.createElement('h1');
            div_reverse.innerHTML = data.relations.reverse.name;
            reverse.append(div_reverse);
            renderHexagram("reverse-hexagram", data.relations.reverse.binary);
            
            const inverse = document.getElementById("inverse-hexagram");
            const div_inverse = document.createElement('h1');
            div_inverse.innerHTML = data.relations.inverse.name;
            inverse.append(div_inverse);
            renderHexagram("inverse-hexagram", data.relations.inverse.binary);
        }
    } catch (error) {
        console.error('Error displaying hexagram:', error);
    }
}
