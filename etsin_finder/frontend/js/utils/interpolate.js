import { escape } from 'lodash'

const matchRegex = /%\((.+?)\)s/g // E.g. %(key)s

const interpolate = (input, context = {}) => {
  // String interpolation. Replaces e.g. %(key)s in string with context[key]
  // If input is an object, values in the object are translated recursively.

  if (typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([key, val]) => [key, interpolate(val, context)])
    )
  }

  const matches = input.matchAll(matchRegex)
  let out = input
  for (const match of matches) {
    const repl = match[0] // E.g. %(key)s
    const key = match[1] // E.g. key
    if (context[key] != null) {
      out = out.replace(repl, escape(context[key]))
    }
  }
  return out
}

export default interpolate
