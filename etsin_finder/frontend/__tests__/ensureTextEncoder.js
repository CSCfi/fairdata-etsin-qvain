// TextEncoder and TextDecoder are needed by react-router 17
// and have to exist before importing anything from react-router.
import { TextEncoder, TextDecoder } from 'node:util'

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder
}
