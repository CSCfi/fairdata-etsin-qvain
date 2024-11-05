import styled from 'styled-components'

export const ModalDivider = styled.div`
  border-top: 1px solid #b5b5b5;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

export const modalStyle = {
  content: {
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    position: 'relative',
    maxHeight: '95vh',
    minWidth: '300px',
    maxWidth: '750px',
    margin: '0.5em',
    border: 'none',
    padding: '1.5rem 2.5rem',
    boxShadow: '0px 6px 12px -3px rgba(0, 0, 0, 0.15)',
    overflow: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}

export const ModalHeader = styled.h2`
  display: flex;
  justify-content: center;
  line-height: 1.25;
`
export const ModalLabel = styled.h3`
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1rem;
  color: #222;
  margin-bottom: 0;
`
