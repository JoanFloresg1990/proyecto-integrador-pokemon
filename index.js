const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark-mode') {
    body.classList.add('dark-mode');
    toggleButton.textContent = '☀️ Modo Claro';
}

toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        toggleButton.textContent = '☀️ Modo Claro';
        localStorage.setItem('theme', 'dark-mode');
    } else {
        toggleButton.textContent = '🌙 Modo Oscuro';
        localStorage.setItem('theme', 'light-mode');
    }
});

const searchInput = document.querySelector('.search-area input');

const resultsContainer = document.getElementById('results-container');

async function searchPokemon(pokemonName) {
    const lowerCaseName = String(pokemonName).toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${lowerCaseName}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Pokemon no encontrado');
        }

        const data = await response.json();
        displayPokemon(data);

    } catch (error) {
        console.error('Hubo un error', error);
        
        resultsContainer.classList.add('centered');
        
        resultsContainer.innerHTML = `
            <div class="error-message">
                <p>❌ No encontramos a "${pokemonName}"</p>
                <p>Intenta verificar el nombre.</p>
            </div>
        `;
    }
}

searchInput.addEventListener('change', async () => {
    const text = searchInput.value;

    if (text) {
        resultsContainer.classList.add('centered');
        
        resultsContainer.innerHTML = '<div class="loader"></div>';
        
        await searchPokemon(text);

    } else {
        resultsContainer.classList.remove('centered');
        loadPokedex();
    }
});

function displayPokemon(pokemon) {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.remove();
    }

    const peso = pokemon.weight / 10;
    const altura = pokemon.height / 10;

    const habilidades = pokemon.abilities.map(item => item.ability.name).join(', ');

    const html = `
        <div class="pokemon-card">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2>${pokemon.name.toUpperCase()}</h2>
            
            <div class="info">
                <span class="type">${pokemon.types[0].type.name}</span>
                <p class="id-number">#${pokemon.id}</p>
            </div>

            <div class="stats">
                <p class="stat-item">⚖️ ${peso}kg</p>
                <p class="stat-item">📏 ${altura}m</p>
            </div>

            <div class="abilities-section">
                <p class="ability-label">⚡️ Poderes:</p>
                <p class="ability-text">${habilidades}</p>
            </div>
        </div>
    `;

    resultsContainer.innerHTML += html;
}

async function loadPokedex(){
    resultsContainer.classList.remove('centered');
    resultsContainer.innerHTML = '';

    for (let i = 1; i <= 30; i++){

        const randomId = Math.floor(Math.random()*1025)+1;
        await searchPokemon(randomId);
    }
}
loadPokedex();
