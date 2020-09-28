import Actors from './qvain.actors'
import Files from './qvain.files'
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
import FilesV1 from './common.filesv1'

class Resources extends FilesV1 {
  constructor(Qvain) {
    super()
    this.Title = new Title(Qvain)
    this.Description = new Description(Qvain)
    this.Files = new Files(Qvain)
    this.Actors = new Actors(Qvain)
    this.Spatials = new Spatials(Qvain)
    this.Temporals = new Temporals(Qvain)
    this.Provenances = new Provenances(Qvain)
    this.RelatedResources = new RelatedResources(Qvain)
    this.Infrastructures = new Infrastructures(Qvain)
    this.OtherIdentifiers = new OtherIdentifiers(Qvain)
    this.FieldOfSciences = new FieldOfSciences(Qvain)
    this.DatasetLanguages = new DatasetLanguages(Qvain)
    this.Keywords = new Keywords(Qvain)
    this.IssuedDate = new IssuedDate(Qvain)
    this.AccessType = new AccessType(Qvain)
    this.Projects = new Projects(Qvain)
    this.Licenses = new Licenses(Qvain)
    this.EmbargoExpDate = new EmbargoExpDate(Qvain)
    this.RestrictionGrounds = new RestrictionGrounds(Qvain)
    this.resources = [
      this.Title,
      this.Description,
      this.Files,
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
