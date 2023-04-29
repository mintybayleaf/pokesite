async function* fetchPokemonList({offset = 0, limit = 100, end = null} = {}) {
  end = end || 0
  let url = new URL('pokemon', 'https://pokeapi.co/api/v2/')
  url.searchParams.set('limit', limit)
  url.searchParams.set('offset', offset)

  while (url && offset < end) {
    const response = await fetch(url)
    const { next, results } = await response.json()
    url = next ?? new URL(next)
    offset += results.length
    console.log(Math.min(end, offset))
    for(let pokemon of results.slice(0, Math.min(end, offset))) {
      yield pokemon
    }
  }
}



for await (const pokemon of fetchPokemonList({offset: 0, limit: 10, end: 15})) {
  console.log(pokemon.name)
}