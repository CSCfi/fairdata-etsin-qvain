import styled from 'styled-components'
import PersonInput from './personInput'
import { useStores } from '@/stores/stores'

export const PersonFormBase = () => {
  const {
    Qvain: {
      Actors: { personNameSchema, personEmailSchema, personIdentifierSchema },
    },
  } = useStores()
  return (
    <>
      <Fields>
        <div>
          <PersonInput propName="name" schema={personNameSchema} includeType required />
        </div>
        <div>
          <PersonInput propName="email" schema={personEmailSchema} />
        </div>
      </Fields>
      <div>
        <PersonInput propName="identifier" schema={personIdentifierSchema} includeType />
      </div>
    </>
  )
}

const Fields = styled.div`
  margin-top: 0.5rem;
  display: grid;
  column-gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`

export default PersonFormBase
