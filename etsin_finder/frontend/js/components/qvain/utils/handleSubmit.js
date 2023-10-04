import { REMOTE_RESOURCES_DATA_CATALOGS, ACCESS_TYPE_URL } from '../../../utils/constants'

/* eslint-disable camelcase */
const handleSubmitToBackend = Qvain => {
  const title = Qvain.Title.toBackend()

  const description = Qvain.Description.toBackend()

  const theme = Qvain.SubjectHeadings.toBackend()

  const { creator, publisher, curator, rights_holder, contributor } = Qvain.Actors.toBackend()

  const spatial = Qvain.Spatials.toBackend()

  const temporal = Qvain.Temporals.toBackend()

  const relation = Qvain.RelatedResources.toBackend()

  const provenance = Qvain.Provenances.toBackend()

  const field_of_science = Qvain.FieldOfSciences.toBackend()

  const language = Qvain.DatasetLanguages.toBackend()

  const issued = Qvain.IssuedDate.toBackend()

  const accessType = Qvain.AccessType.toBackend()

  const projects = Qvain.ProjectV2.toBackend()

  const license = Qvain.Licenses.toBackend()

  const embargoDate = Qvain.EmbargoExpDate.toBackend()

  const restrictionGrounds = Qvain.RestrictionGrounds.toBackend()

  const keyword = Qvain.Keywords.toBackend()

  const modified = new Date().toISOString()

  const obj = {
    title,
    description,
    other_identifier: Qvain.OtherIdentifiers.toBackend(),
    keyword,
    theme,
    creator,
    publisher,
    rights_holder,
    curator,
    contributor,
    infrastructure: Qvain.Infrastructures.toBackend(),
    access_rights: {
      license,
      access_type: accessType,
      available: embargoDate,
    },
    data_catalog: Qvain.dataCatalog,
    cumulative_state: Qvain.cumulativeState,
    use_doi: Qvain.useDoi,
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

  if (REMOTE_RESOURCES_DATA_CATALOGS.includes(Qvain.dataCatalog)) {
    obj.remote_resources = Qvain.ExternalResources.toBackend()
  }

  if (Qvain.Files.useV3 && Qvain.Files.root?.directChildCount > 0) {
    // file additions, removals and metadata changes
    obj.data = Qvain.Files.actionsToMetax()
  }

  if (Qvain.original) {
    obj.original = Qvain.original
  }

  return obj
}

export default handleSubmitToBackend
