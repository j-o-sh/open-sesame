/**
 * Premise: HTML and the Web Platform is awesome and often we would not need a
 * framework in the first place.
 *
 * It is however missing some sleek api sugar and some best practices built-in.
 *
 * This is where vanilla+ comes in.
 */

const listeners = {}

const log = (...stuff) => console.log('🍦', ...stuff)

function pushListener(type, listener) {
  if (!listeners[type]) {
    listeners[type] = []
    document.addEventListener(
      type, 
      event => {
        listeners[type].forEach(l => l(event))
        log(type, '**', listeners[type])
      }
    )
    log('added listener for', type)
  }
  listeners[type].push(listener)
}

function whenAt(selector, performOn) {
  return event => {
    const target = event.target.closest(selector)
    if (target) {
      performOn(target)
    }
  }
}

export function at (selector) {
  return { set: (attribute, value) => {
    for (const element of document.querySelectorAll(selector)) {
      element.setAttribute(attribute, value)
    }
  }}
}

/**
 * Example: v.on('load').at('input[name=salt]').set('value', Date.now())
 */
export function on (type) {
  return { at: selector => ({ set: (attribute, value) => {
    pushListener(type, whenAt(
      selector, 
      target => target.setAttribute(attribute, value)
    ))
  }})}
}

