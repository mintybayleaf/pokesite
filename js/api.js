import cache from './cache.js'

async function* fetchPokemonList({offset, limit}) {
  let url = new URL('pokemon', 'https://pokeapi.co/api/v2/')
  url.searchParams.set('limit', limit)
  url.searchParams.set('offset', offset)
  const response = await fetch(url)
  const { results } = await response.json()
  yield* results
}

function sanitizePokemon({id, name, height, weight, sprites}) {
  return {id, name, height, weight, normalImage: sprites.front_default, shinyImage: sprites.front_shiny}
}

async function fetchPokemon({url}) {
   const fetchURL = new URL(url)
   const response = await fetch(fetchURL)
   const pokemon = await response.json()
   return {...sanitizePokemon(pokemon), url}
}

// eslint-disable-next-line no-func-assign
fetchPokemon = cache.asyncCached(fetchPokemon)

async function* fetchAllPokemon(offset = 0, limit = 100) {
  const BATCHSIZE = 10
  const promises = []
  for await (const pokemonInfo of fetchPokemonList({offset, limit})) {
    promises.push(fetchPokemon(pokemonInfo))
    if (promises.length % BATCHSIZE === 0) {
      const values = await Promise.allSettled(promises)
      yield* values
          .filter(({status}) => status === 'fulfilled')
          .map(({value}) => value)
      promises.splice(0, promises.length)
    }
  }
}

export default fetchAllPokemon