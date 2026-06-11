import isPropValid from '@emotion/is-prop-valid'

// Helper to prevent sending invalid props to DOM. Use when you have styled components
// that use props that are not valid in DOM.
//
// Usage example: withCustomProps(styled.div)``

interface WithConfig {
  withConfig(config: Record<string, any>): any
}

export default function withCustomProps<T extends WithConfig>(styledThing: T): T {
  return (styledThing as any).withConfig({
    shouldForwardProp: (prop: string) => isPropValid(prop),
  }) as T
}
