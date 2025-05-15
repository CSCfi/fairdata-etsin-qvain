import isPropValid from '@emotion/is-prop-valid'

// Helper to prevent sending invalid props to DOM. Use when you have styled components
// that use props that are not valid in DOM.
//
// Usage example: withCustomProps(styled.div)``
export default styledThing =>
  styledThing.withConfig({
    shouldForwardProp: prop => isPropValid(prop),
  })
