import React from 'react'
import styled from 'styled-components'
import PersonInput from './personInput'
import { useStores } from '../../../../utils/stores'

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
      <PersonInput propName="identifier" schema={personIdentifierSchema} includeType />
    </>
  )
}

const Fields = styled.div`
  display: grid;
  column-gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`

export default PersonFormBase
