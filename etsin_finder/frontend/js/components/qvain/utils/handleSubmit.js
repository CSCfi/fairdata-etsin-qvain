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

  const issuedDate = values.IssuedDate.toBackend()

  const accessType = values.AccessType.toBackend()

  const projects = values.Projects.toBackend()

  const license = values.Licenses.toBackend()

  const embargoDate = values.EmbargoExpDate.toBackend()

  const restrictionGrounds = values.RestrictionGrounds.toBackend()

  const keywords = values.Keywords.toBackend()

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
      restriction_grounds: restrictionGrounds,
      available: embargoDate
    },
    remote_resources: values.ExternalResources.toBackend(),
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
    issuedDate,
  }

  if (values.original) {
    obj.original = values.original
  }

  return obj
}

export default handleSubmitToBackend
