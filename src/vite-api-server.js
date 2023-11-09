/**
 * @typedef {(...params: string[]) => any} HandlerFunction
 */

/**
 * @typedef {Object.<string|RegExp, {
 *   [method: string]: HandlerFunction
 * }>} ApiObject
 */

function toPathMatcher([key, handler]) {
  if (typeof key.exec === 'function') {
    return clue => {
      const match = key.exec(clue)
      return match && [handler, match.slice(1)]
    }
  } else {
    return clue => clue.startsWith(key) && [handler]
  } 
}

/**
 * creates a binding function to bind request urls against the defined api
 * endpoints
 *
 * @param {ApiObject} api - The API definition object.
 * @returns {(path: string) => [HandlerFunction?, string[]?]}
 */
function createBindings(api) {
  const matchers = Object.entries(api).map(toPathMatcher)
  
  return path => {
    for (let matcher of matchers) {
      const match = matcher(path)
      if (match) return match
    }
    return []
  }
}

/**
 * @param {Object.<string|RegExp, {
 *   [method: string]: ((params?: Record<string, string|string[]>|undefined) => any)
 * }>} api - The API definition object.
 */
function apiServer(api) {

  const bind = createBindings(api)

  /**
   * api server handler
   *
   * @param {import('http').IncomingMessage} req - The HTTP request object.
   * @param {import('http').ServerResponse} res - The HTTP response object.
   * @param {function} next - The next middleware function in the chain.
   * @returns {void}
   */
  return function handle(req, res, next) {
    const { url, method } = req
    const [endpoint, matches = []] = bind(url)
    const endWithStatus = (code, payload) => {
        res.statusCode = code
        res.end(`${payload}`)
    }

    console.info('✨ ', method, '\t', url, matches, endpoint)
    if (endpoint) {
      try {
        const handler = endpoint[method.toLowerCase()]

        if (handler) {
          handler(...matches)
            .then(x => res.end(x))
            .catch(e => endWithStatus(500, e)) 
        } else {
          endWithStatus(400, '👮‍♀️')
        }
      } catch (e) {
        endWithStatus(500, e)
      }
    } else {
      next()
    }
  }
}

export function viteApiServer(api) {
  return {
    name: 'vite-api-server',
    configureServer(server) {
      server.middlewares.use(apiServer(api))
    },
  }
}

