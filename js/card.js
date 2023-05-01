import fetchAllPokemon from "./api.js"

function createBulbapediaURL({ name }) {
  return `https://bulbapedia.bulbagarden.net/wiki/${name}`
}

function create(pokemon) {
  const card = document.createElement('div')
  card.classList.add('card')
  card.innerHTML = `
  <figure>
    <img id="${pokemon.name}" src=${pokemon.normalImage} alt="${pokemon.name}">
    <figcaption>
      <h3>${pokemon.name}</h3>
      <p>H: ${pokemon.height} dm</p>
      <p>W: ${pokemon.weight} hg</p>
    </figcaption>
  </figure>
  `
  card.addEventListener('click', () => {
    window.open(createBulbapediaURL(pokemon), "_blank")
  })
  card.addEventListener('mouseenter', () => {
    const image = document.getElementById(pokemon.name)
    image.src = pokemon.shinyImage
  })
  card.addEventListener('mouseleave', () => {
    const image = document.getElementById(pokemon.name)
    image.src = pokemon.normalImage
  })
  return card
}

async function createCards(offset = 0, limit = 100) {
  const root = document.getElementById('container')
  for await (const pokemon of fetchAllPokemon(offset, limit)) {
    if (pokemon && pokemon.name && pokemon.normalImage && pokemon.shinyImage) {
      const card = create(pokemon)
      root.append(card)
  }

  }
}

// State
let currentOffset = 0
let currentLimit = 100
let ticking = false;

// Load the pokemon cards when the browser DOM loads
// Since this is a module I really do not need this but I think it looks nicer
document.addEventListener("DOMContentLoaded", async () => {
  await createCards(currentOffset, currentLimit)
});

// Set a scroll event on the container that holds the cards
document.addEventListener("scroll", () => {
  const lastKnownScrollPosition = Math.round(window.scrollY);

  if (!ticking) {
    window.requestAnimationFrame(async () => {
       if (window.innerHeight + lastKnownScrollPosition >= document.body.offsetHeight) {
        // at the bottom of the page
        currentOffset += currentLimit
        await createCards(currentOffset, currentLimit)
    }
      ticking = false;
    });

    ticking = true;
  }
});