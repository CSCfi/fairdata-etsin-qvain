import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import { getActorName, ActorIcon } from '../common'
import {
  EditButton,
  DeleteButton,
  ListItemButtonContainer,
} from '@/components/qvain/general/V2/buttons'
import { FieldListContainer, FieldListLabel } from '@/components/qvain/general/V2/ModalFieldList'

const ActorItem = ({ actor }) => {
  const Stores = useStores()
  const { editActor, removeActor } = Stores.Qvain.Actors
  const { lang, translate } = Stores.Locale
  const { readonly } = Stores.Qvain

  const handleEditActor = () => {
    editActor(actor)
  }

  const handleRemoveActor = () => {
    removeActor(actor)
  }

  const translateRole = role => {
    const part = translate(`qvain.actors.add.checkbox.${role}`)
    return ` / ${part}`
  }

  return (
    <FieldListContainer>
      <FieldListLabel className="actor-label">
        <ActorIcon actor={actor} style={{ marginRight: '8px' }} />
        {getActorName(actor, lang)}
        {actor.roles.map(translateRole)}
      </FieldListLabel>
      <ListItemButtonContainer>
        <Translate
          component={EditButton}
          type="button"
          onClick={handleEditActor}
          attributes={{ 'aria-label': 'qvain.general.buttons.edit' }}
        />
        {!readonly && (
          <Translate
            component={DeleteButton}
            type="button"
            onClick={handleRemoveActor}
            attributes={{ 'aria-label': 'qvain.general.buttons.remove' }}
          />
        )}
      </ListItemButtonContainer>
    </FieldListContainer>
  )
}

ActorItem.propTypes = {
  actor: PropTypes.object.isRequired,
}

export default observer(ActorItem)
