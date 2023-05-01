function createAsyncCachingDecorator(get, set) {
  return function(func) {
    return async function(key, ...args) {
      let cacheKey = JSON.stringify(key)
      if (get(cacheKey)) {
        return JSON.parse(get(cacheKey))
      }
      const result = await func(key, ...args)
      set(cacheKey, JSON.stringify(result))
      return result
    }
  }
}

export default {
  asyncCached: createAsyncCachingDecorator(localStorage.getItem.bind(localStorage), localStorage.setItem.bind(localStorage))
}