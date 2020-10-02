import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import ConfirmDialog from './confirmDialog'

const LooseProvenanceDialog = ({ Stores }) => {
  const getLooseProvenanceDialogProps = () => {
    const { promptLooseProvenances, provenancesWithNonExistingActors } = Stores.Qvain
    const { lang } = Stores.Locale
    return {
      show: !!promptLooseProvenances,
      onCancel: () => promptLooseProvenances(false),
      onConfirm: () => promptLooseProvenances(true),
      content: {
        warning: (
          <>
            <Translate content={'qvain.general.looseProvenances.warning'} component="p" />
            <div>{provenancesWithNonExistingActors.map(p => p.name[lang] || p.name.und)}</div>
            <div style={{ margin: 10 }} />
            <Translate
              content={'qvain.general.looseProvenances.question'}
              style={{ fontWeight: 600 }}
            />
          </>
        ),
        confirm: <Translate content={'qvain.general.looseProvenances.confirm'} />,
        cancel: <Translate content={'qvain.general.looseProvenances.cancel'} />,
      },
    }
  }

  return <ConfirmDialog {...getLooseProvenanceDialogProps()} />
}

LooseProvenanceDialog.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(LooseProvenanceDialog))
