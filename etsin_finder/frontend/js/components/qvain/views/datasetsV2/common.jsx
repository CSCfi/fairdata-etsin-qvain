import styled from 'styled-components'

export const Tab = styled.button.attrs({ type: 'button', role: 'tab' })`
  color: black;
  font-size: 18px;
  padding: 0.5rem 1.5rem 0.25rem;
  border: none;
  background: transparent;
  border-bottom: 4px solid transparent;
  border-radius: 4px 4px 0 0;
  margin-bottom: -4px;
  cursor: pointer;

  ${p =>
    p['aria-selected'] &&
    `background: #eaf4f8;
    border-bottom: 4px solid ${p.theme.color.primary};`}
`

export const TabRow = styled.div.attrs({ role: 'tablist' })`
  display: flex;
  padding-left: 2rem;
  border-bottom: 4px solid #eee;
  gap: 0.25rem;
`
