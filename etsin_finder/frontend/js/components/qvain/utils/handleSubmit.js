import { REMOTE_RESOURCES_DATA_CATALOGS, ACCESS_TYPE_URL } from '../../../utils/constants'

/* eslint-disable camelcase */
const handleSubmitToBackend = values => {
  const title = values.Title.toBackend()

  const description = values.Description.toBackend()

  const theme = values.SubjectHeadings.toBackend()

  const { creator, publisher, curator, rights_holder, contributor } = values.Actors.toBackend()

  const spatial = values.Spatials.toBackend()

  const temporal = values.Temporals.toBackend()

  const relation = values.RelatedResources.toBackend()

  const provenance = values.Provenances.toBackend()

  const field_of_science = values.FieldOfSciences.toBackend()

  const language = values.DatasetLanguages.toBackend()

  const issued = values.IssuedDate.toBackend()

  const accessType = values.AccessType.toBackend()

  const projects = values.ProjectV2.toBackend()

  const license = values.Licenses.toBackend()

  const embargoDate = values.EmbargoExpDate.toBackend()

  const restrictionGrounds = values.RestrictionGrounds.toBackend()

  const keywords = values.Keywords.toBackend()

  const modified = new Date().toISOString()

  const obj = {
    title,
    description,
    other_identifier: values.OtherIdentifiers.toBackend(),
    keywords,
    theme,
    creator,
    publisher,
    rights_holder,
    curator,
    contributor,
    infrastructure: values.Infrastructures.toBackend(),
    access_rights: {
      license,
      access_type: accessType,
      available: embargoDate,
    },
    dataCatalog: values.dataCatalog,
    cumulativeState: values.cumulativeState,
    useDoi: values.useDoi,
    is_output_of: projects,
    spatial,
    temporal,
    relation,
    provenance,
    field_of_science,
    language,
    issued,
    modified,
  }

  if (accessType?.identifier !== ACCESS_TYPE_URL.OPEN) {
    obj.access_rights.restriction_grounds = restrictionGrounds
  }

  if (REMOTE_RESOURCES_DATA_CATALOGS.includes(values.dataCatalog)) {
    obj.remote_resources = values.ExternalResources.toBackend()
  }

  if (values.original) {
    obj.original = values.original
  }

  return obj
}

export default handleSubmitToBackend
