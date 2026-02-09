import * as yup from 'yup'

import { override } from 'mobx'
import SingleValueField from './qvain.singleValueField'

export const dataAccessTypeSchema = yup
  .string('qvain.validationMessages.approvalType.string')
  .when('$Qvain', {
    // Use Qvain store from the the validation context for determining
    // if approval type is required.
    is: Qvain => {
      if (!Qvain) {
        throw new Error('Qvain missing from validation context')
      }
      return (
        Qvain.isREMSAllowed && Qvain.DataAccess.shouldShowREMSApprovalType(Qvain.AccessType.value)
      )
    },
    then: schema => schema.required('qvain.validationMessages.approvalType.required'),
    otherwise: schema => schema.nullable(),
  })
  .test(
    'valid-approval-type',
    'qvain.validationMessages.approvalType.disallowed',
    function (value) {
      // eslint-disable-next-line no-invalid-this
      const Qvain = this.options.context.Qvain
      if (value === 'manual' && !Qvain?.isManualREMSApprovalAllowed) {
        return false
      }
      return true
    }
  )

class REMSApprovalTypeField extends SingleValueField {
  // SingleValueField that supplies the Qvain store in validation context

  constructor({ Qvain, Parent }) {
    super(Parent, dataAccessTypeSchema)
    this.Qvain = Qvain
  }

  @override
  validate() {
    this.Schema.validate(this.value, { strict: true, context: { Qvain: this.Qvain } })
      .then(() => {
        this.setValidationError(null)
      })
      .catch(err => {
        this.setValidationError(err.errors)
      })
  }
}

export default REMSApprovalTypeField
