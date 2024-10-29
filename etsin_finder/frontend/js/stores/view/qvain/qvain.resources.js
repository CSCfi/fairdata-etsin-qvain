import { computed } from 'mobx'

import AccessRightsDescription from './qvain.accessRightsDescription'
import AccessType from './qvain.accessType'
import Actors from './qvain.actors'
import ActorsV3 from './qvain.actors.v3'
import BibliographicCitation from './qvain.bibliographicCitation'
import DatasetLanguages from './qvain.datasetLanguage'
import Description from './qvain.description'
import EmbargoExpDate from './qvain.embargoExpDate'
import ExternalResources from './qvain.externalResources'
import FieldOfSciences from './qvain.fieldOfScience'
import Infrastructures from './qvain.infrastructure'
import IssuedDate from './qvain.issuedDate'
import Keywords from './qvain.keyword'
import Licenses from './qvain.license'
import OtherIdentifiers from './qvain.otherIdentifier'
import ProjectV2 from './qvain.projectV2'
import { Projects } from './sections/qvain.projects.v3'
import Provenances from './qvain.provenances'
import RelatedResources from './qvain.relatedResources'
import RestrictionGrounds from './qvain.restrictionGrounds'
import Spatials from './qvain.spatials'
import SubjectHeadings from './qvain.subjectHeadings'
import Temporals from './qvain.temporals'
import Title from './qvain.title'

class Resources {
  constructor(Env, OrgReferences) {
    this.Env = Env
    this.OrgReferences = OrgReferences
    this.AccessRightsDescription = new AccessRightsDescription(this)
    this.AccessType = new AccessType(this)
    this.ActorsV2 = new Actors(this)
    this.ActorsV3 = new ActorsV3(this)
    this.BibliographicCitation = new BibliographicCitation(this)
    this.DatasetLanguages = new DatasetLanguages(this)
    this.Description = new Description(this)
    this.EmbargoExpDate = new EmbargoExpDate(this)
    this.ExternalResources = new ExternalResources(this)
    this.FieldOfSciences = new FieldOfSciences(this)
    this.Infrastructures = new Infrastructures(this)
    this.IssuedDate = new IssuedDate(this)
    this.Keywords = new Keywords(this)
    this.Licenses = new Licenses(this)
    this.OtherIdentifiers = new OtherIdentifiers(this)
    this.Projects = new Projects(this)
    this.ProjectV2 = new ProjectV2(this)
    this.Provenances = new Provenances(this)
    this.RelatedResources = new RelatedResources(this)
    this.RestrictionGrounds = new RestrictionGrounds(this)
    this.Spatials = new Spatials(this)
    this.SubjectHeadings = new SubjectHeadings(this)
    this.Temporals = new Temporals(this)
    this.Title = new Title(this)
    this.resources = [
      this.AccessRightsDescription,
      this.AccessType,
      this.Actors,
      this.BibliographicCitation,
      this.Description,
      this.DatasetLanguages,
      this.EmbargoExpDate,
      this.ExternalResources,
      this.FieldOfSciences,
      this.Infrastructures,
      this.IssuedDate,
      this.Keywords,
      this.Licenses,
      this.OtherIdentifiers,
      this.Projects,
      this.ProjectV2,
      this.Provenances,
      this.RelatedResources,
      this.RestrictionGrounds,
      this.Spatials,
      this.SubjectHeadings,
      this.Temporals,
      this.Title,
    ]
  }

  @computed get Actors() {
    if (this.Env.Flags.flagEnabled('QVAIN.METAX_V3.FRONTEND')) {
      return this.ActorsV3
    }
    return this.ActorsV2
  }
}

export default Resources
