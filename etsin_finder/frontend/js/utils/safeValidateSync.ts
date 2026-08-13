import * as yup from 'yup'

/**
 * Validate value using schema but instead of throwing an error,
 * log validation warnings.
 */
function safeValidateSync<T>(schema: yup.Schema<T>, value: unknown): T {
  try {
    return schema.validateSync(value)
  } catch (err) {
    console.warn('Validation failed', err)
  }

  // Attempt to cast values but don't throw error if some values fail.
  // The typescript typing may be inaccurate in that case.
  return schema.cast(value, { assert: false })
}

export default safeValidateSync
