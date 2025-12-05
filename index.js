// Obtener el botón de cambio de tema y el cuerpo del documento
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Verificar si hay un tema guardado en el navegador y aplicarlo
if (localStorage.getItem('theme') === 'dark-mode') {
    body.classList.add('dark-mode');
    toggleButton.textContent = '☀️ Modo Claro';
}

// Agregar evento al botón para cambiar entre modo claro y oscuro
toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    // Cambiar el texto del botón y guardar la preferencia
    if (body.classList.contains('dark-mode')) {
        toggleButton.textContent = '☀️ Modo Claro';
        localStorage.setItem('theme', 'dark-mode');
    } else {
        toggleButton.textContent = '🌙 Modo Oscuro';
        localStorage.setItem('theme', 'light-mode');
    }
});

// Obtener el input de búsqueda y el contenedor de resultados
const searchInput = document.querySelector('.search-area input');
const resultsContainer = document.getElementById('results-container');

// Función para buscar un pokemon en la API
async function searchPokemon(pokemonName) {
    // Convertir el nombre a minúsculas para la búsqueda
    const lowerCaseName = String(pokemonName).toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${lowerCaseName}`;

    try {
        // Hacer la petición a la API
        const response = await fetch(url);

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Pokemon no encontrado');
        }

        // Convertir la respuesta a JSON y mostrar el pokemon
        const data = await response.json();
        displayPokemon(data);

    } catch (error) {
        // Mostrar mensaje de error si no se encuentra el pokemon
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

// Escuchar cuando el usuario escribe en el campo de búsqueda
searchInput.addEventListener('change', async () => {
    const text = searchInput.value;

    // Si hay texto, buscar el pokemon
    if (text) {
        resultsContainer.classList.add('centered');
        
        // Mostrar un loader mientras se busca
        resultsContainer.innerHTML = '<div class="loader"></div>';
        
        await searchPokemon(text);

    } else {
        // Si no hay texto, mostrar el pokedex completo
        resultsContainer.classList.remove('centered');
        loadPokedex();
    }
});

// Función para mostrar la información de un pokemon en una tarjeta
function displayPokemon(pokemon) {
    // Remover el loader si existe
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.remove();
    }

    // Convertir peso y altura a unidades más legibles (kg y metros)
    const peso = pokemon.weight / 10;
    const altura = pokemon.height / 10;

    // Obtener todas las habilidades y unirlas en un string
    const habilidades = pokemon.abilities.map(item => item.ability.name).join(', ');

    // Crear el HTML de la tarjeta del pokemon
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

    // Agregar la tarjeta al contenedor de resultados
    resultsContainer.innerHTML += html;
}

// Función para cargar 30 pokemon aleatorios al inicio
async function loadPokedex(){
    resultsContainer.classList.remove('centered');
    resultsContainer.innerHTML = '';

    // Generar 30 pokemon aleatorios
    for (let i = 1; i <= 30; i++){
        // Generar un ID aleatorio entre 1 y 1025
        const randomId = Math.floor(Math.random()*1025)+1;
        await searchPokemon(randomId);
    }
}
// Cargar el pokedex cuando se abre la página
loadPokedex();
