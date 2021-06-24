import * as yup from 'yup'
import ReferenceField from './qvain.referenceField'
import { LICENSE_URL } from '../../../utils/constants'

export const licenseSchema = yup.object().shape({
  name: yup.object().nullable(),
  identifier: yup.string().required(),
  otherLicenseUrl: yup
    .string()
    .typeError('qvain.validationMessages.license.otherUrl.string')
    .url('qvain.validationMessages.license.otherUrl.url')
    .required('qvain.validationMessages.license.otherUrl.required')
    .nullable(),
})

const licenseArrayObject = yup.object().shape({
  name: yup.object().nullable(),
  identifier: yup
    .string()
    .typeError('qvain.validationMessages.license.otherUrl.string')
    .url('qvain.validationMessages.license.otherUrl.url')
    .required('qvain.validationMessages.license.otherUrl.required'),
})

export const licenseArraySchema = yup.array().of(licenseArrayObject).nullable()

export const Model = (name, identifier) => ({
  name,
  identifier,
})

class Licenses extends ReferenceField {
  constructor(Parent) {
    super(Parent, () => [Model(undefined, LICENSE_URL.CCBY4)])
  }

  schema = licenseSchema

  arraySchema = licenseArraySchema

  arrayObjectSchema = licenseArrayObject

  fromBackend = dataset => {
    const l = dataset.access_rights.license ? dataset.access_rights.license : undefined
    if (l !== undefined) {
      this.item = undefined
      this.storage = l.map(license => {
        if (license.identifier !== undefined) {
          return this.Model(license.title, license.identifier)
        }
        const name = {
          en: `Other (URL): ${license.license}`,
          fi: `Muu (URL): ${license.license}`,
        }
        return this.Model(name, license.license)
      })
    } else {
      this.item = undefined
      this.storage = []
    }
  }

  toBackend = () => this.storage

  Model = Model
}

export default Licenses
