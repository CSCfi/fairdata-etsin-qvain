import { computed } from 'mobx'

import Actors from './qvain.actors'
import Spatials from './qvain.spatials'
import Provenances from './qvain.provenances'
import RelatedResources from './qvain.relatedResources'
import Temporals from './qvain.temporals'
import Infrastructures from './qvain.infrastructure'
import OtherIdentifiers from './qvain.otherIdentifier'
import FieldOfSciences from './qvain.fieldOfScience'
import DatasetLanguages from './qvain.datasetLanguage'
import Keywords from './qvain.keyword'
import IssuedDate from './qvain.issuedDate'
import AccessType from './qvain.accessType'
import Projects from './qvain.project'
import ProjectV2 from './qvain.projectV2'
import Licenses from './qvain.license'
import EmbargoExpDate from './qvain.embargoExpDate'
import RestrictionGrounds from './qvain.restrictionGrounds'
import Title from './qvain.title'
import SubjectHeadings from './qvain.subjectHeadings'
import Description from './qvain.description'
import ExternalResources from './qvain.externalResources'
import ActorsV3 from './qvain.actors.v3'
import BibliographicCitation from './qvain.bibliographicCitation'

class Resources {
  constructor(Env) {
    this.Env = Env
    this.Title = new Title(this)
    this.Description = new Description(this)
    this.SubjectHeadings = new SubjectHeadings(this)
    this.ActorsV2 = new Actors(this)
    this.ActorsV3 = new ActorsV3(this)
    this.Spatials = new Spatials(this)
    this.Temporals = new Temporals(this)
    this.Provenances = new Provenances(this)
    this.RelatedResources = new RelatedResources(this)
    this.Infrastructures = new Infrastructures(this)
    this.OtherIdentifiers = new OtherIdentifiers(this)
    this.FieldOfSciences = new FieldOfSciences(this)
    this.DatasetLanguages = new DatasetLanguages(this)
    this.Keywords = new Keywords(this)
    this.IssuedDate = new IssuedDate(this)
    this.AccessType = new AccessType(this)
    this.Projects = new Projects(this)
    this.ProjectV2 = new ProjectV2(this)
    this.Licenses = new Licenses(this)
    this.EmbargoExpDate = new EmbargoExpDate(this)
    this.RestrictionGrounds = new RestrictionGrounds(this)
    this.ExternalResources = new ExternalResources(this)
    this.BibliographicCitation = new BibliographicCitation(this)
    this.resources = [
      this.Title,
      this.Description,
      this.SubjectHeadings,
      this.Actors,
      this.Spatials,
      this.Temporals,
      this.Provenances,
      this.RelatedResources,
      this.Infrastructures,
      this.OtherIdentifiers,
      this.FieldOfSciences,
      this.DatasetLanguages,
      this.Keywords,
      this.IssuedDate,
      this.AccessType,
      this.Projects,
      this.ProjectV2,
      this.Licenses,
      this.EmbargoExpDate,
      this.RestrictionGrounds,
      this.ExternalResources,
      this.BibliographicCitation,
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
