import styled from 'styled-components'

export const ButtonContainer = styled.div`
  margin-top: 0.5rem;
`

export const ButtonGroup = styled.div`
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.13);
  border: solid 1px #cccccc;
  border-radius: 4px;
  background-color: #fff;
  margin-bottom: 12px;
  overflow: hidden;

  > ${ButtonContainer} {
    margin-top: 0;
    text-align: right;
  }
`

export const FileItem = styled(ButtonGroup)`
  ${props => {
    if (props.active) {
      return `
    border-bottom: none;
    box-shadow: none;
    margin-bottom: 0px;
  `
    }
    return ''
  }}
`

export const ConfirmButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
  margin: 0 -1.5rem;
  padding: 0 1rem;
`
