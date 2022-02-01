import { faEdit, faEye, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { DATA_CATALOG_IDENTIFIER } from '../../../../utils/constants'

export const getEnterEditAction = (Stores, dataset) => {
  const {
    Env: { getQvainUrl, history },
    Matomo,
  } = Stores

  return {
    text: dataset.next_draft ? 'qvain.datasets.actions.editDraft' : 'qvain.datasets.actions.edit',
    shortText: dataset.next_draft ? 'qvain.datasets.shortActions.editDraft' : 'qvain.datasets.actions.edit',
    danger: false,
    icon: faEdit,
    onlyIcon: false,
    handler: () => {
      if (dataset.next_draft) {
        Matomo.recordEvent(`EDIT / ${dataset.next_draft.identifier}`)
        history.push(getQvainUrl(`/dataset/${dataset.next_draft.identifier}`))
        return
      }

      Matomo.recordEvent(`EDIT / ${dataset.identifier}`)
      history.push(getQvainUrl(`/dataset/${dataset.identifier}`))
    },
  }
}

export const getGoToEtsinAction = (Stores, dataset) => {
  const {
    Matomo,
    Env: { getEtsinUrl },
  } = Stores
  let identifier = dataset.identifier
  let goToEtsinKey = 'goToEtsin'
  let query = ''
  if (dataset.next_draft) {
    identifier = dataset.next_draft.identifier
    goToEtsinKey = 'goToEtsinDraft'
    query = '?preview=1'
  } else if (dataset.state === 'draft') {
    goToEtsinKey = 'goToEtsinDraft'
    query = '?preview=1'
  }

  return {
    text: `qvain.datasets.actions.${goToEtsinKey}`,
    shortText: `qvain.datasets.shortActions.${goToEtsinKey}`,
    danger: false,
    icon: faEye,
    onlyIcon: false,
    moreIfNarrow: true,
    handler: () => {
      Matomo.recordEvent(`PREVIEW / ${identifier}`)
      window.open(getEtsinUrl(`/dataset/${identifier}${query}`), '_blank')
    },
  }
}

export const getShareAction = (Stores, dataset) => {
  const { Matomo } = Stores
  const identifier = dataset.identifier
  const {
    share: { modal },
  } = Stores.QvainDatasetsV2

  return {
    text: `qvain.datasets.actions.share`,
    shortText: `qvain.datasets.shortActions.share`,
    danger: false,
    icon: faUserPlus,
    onlyIcon: false,
    moreIfNarrow: true,
    handler: () => {
      modal.open({ dataset })
      Matomo.recordEvent(`SHARE / ${identifier}`)
    },
  }
}

export const getCreateNewVersionAction = (Stores, dataset) => {
  const {
    Env: { getQvainUrl, history },
    Matomo: { recordEvent },
    QvainDatasets: { createNewVersion },
  } = Stores
  const { identifier } = dataset

  return {
    text: 'qvain.datasets.actions.createNewVersion',
    shortText: `qvain.datasets.shortActions.createNewVersion`,
    danger: false,
    more: true,
    handler: async () => {
      const newIdentifier = await createNewVersion(dataset)
      recordEvent(`NEW_VERSION / ${identifier}`)
      history.push(getQvainUrl(`/dataset/${newIdentifier}`))
    },
  }
}

export const getUseAsTemplateAction = (Stores, dataset) => {
  const {
    Env: { getQvainUrl, history },
    Qvain: { resetWithTemplate },
    Matomo: { recordEvent },
  } = Stores

  return {
    text: 'qvain.datasets.actions.useAsTemplate',
    shortText: `qvain.datasets.shortActions.useAsTemplate`,
    danger: false,
    more: true,
    handler: () => {
      history.push(getQvainUrl('/dataset'))
      recordEvent(`TEMPLATE / ${dataset.identifier}`)

      if (dataset.next_draft?.identifier) {
        resetWithTemplate(dataset.next_draft)
      } else {
        resetWithTemplate(dataset)
      }
    },
  }
}

export const getRemoveAction = (Stores, dataset, onlyChanges) => {
  const { Matomo } = Stores
  const { identifier } = dataset
  const { removeModal, removeDataset, removeDatasetChanges } = Stores.QvainDatasets

  return {
    text: onlyChanges ? 'qvain.datasets.actions.revert' : 'qvain.datasets.actions.delete',
    danger: true,
    more: true,
    handler: () =>
      removeModal.open({
        dataset,
        onlyChanges,
        postRemoveCallback: () => {
          // update dataset list after dataset removal
          if (onlyChanges) {
            removeDatasetChanges(dataset)
            Matomo.recordEvent(`REVERT / ${identifier}`)
          } else {
            removeDataset(dataset)
            Matomo.recordEvent(`DELETE / ${identifier}`)
          }
        },
      }),
  }
}

const canCreateNewVersion = dataset =>
  !dataset.next_draft &&
  dataset.next_dataset_version === undefined &&
  dataset.data_catalog?.identifier === DATA_CATALOG_IDENTIFIER.IDA &&
  dataset.state === 'published'

const hasUnpublishedChanges = dataset => !!dataset.next_draft

export const getDatasetActions = (Stores, dataset) => {
  const actions = [
    getEnterEditAction(Stores, dataset),
    getGoToEtsinAction(Stores, dataset),
    getUseAsTemplateAction(Stores, dataset),
  ]
  if (canCreateNewVersion(dataset)) {
    actions.push(getCreateNewVersionAction(Stores, dataset))
  }
  if (hasUnpublishedChanges(dataset)) {
    actions.push(getRemoveAction(Stores, dataset, true))
  }
  actions.push(getRemoveAction(Stores, dataset, false))

  return actions
}

export const getDatasetActionsV2 = (Stores, dataset) => {
  const actions = [
    getEnterEditAction(Stores, dataset),
    getGoToEtsinAction(Stores, dataset),
    getShareAction(Stores, dataset),
    getUseAsTemplateAction(Stores, dataset),
  ]
  if (canCreateNewVersion(dataset)) {
    actions.push(getCreateNewVersionAction(Stores, dataset))
  }
  if (hasUnpublishedChanges(dataset)) {
    actions.push(getRemoveAction(Stores, dataset, true))
  }
  actions.push(getRemoveAction(Stores, dataset, false))

  return actions
}

export const groupActions = (actions, maxButtons) => {
  if (actions.length <= maxButtons) {
    // no dropdown needed
    return { buttonActions: [...actions], dropdownActions: [] }
  }
  // "more" button counts as one button
  const buttonActions = actions.slice(0, maxButtons - 1)
  const dropdownActions = actions.slice(maxButtons - 1)
  return { buttonActions, dropdownActions }
}

export default getDatasetActions
