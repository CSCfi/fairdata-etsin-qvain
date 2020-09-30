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
import Licenses from './qvain.license'
import EmbargoExpDate from './qvain.embargoExpDate'
import RestrictionGrounds from './qvain.restrictionGrounds'
import Title from './qvain.title'
import Description from './qvain.description'
import FilesV1 from './qvain.filesv1'

class Resources extends FilesV1 {
  constructor() {
    super()
    this.Title = new Title(this)
    this.Description = new Description(this)
    this.Actors = new Actors(this)
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
    this.Licenses = new Licenses(this)
    this.EmbargoExpDate = new EmbargoExpDate(this)
    this.RestrictionGrounds = new RestrictionGrounds(this)
    this.resources = [
      this.Title,
      this.Description,
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
      this.Licenses,
      this.EmbargoExpDate,
      this.RestrictionGrounds,
    ]
  }
}

export default Resources
