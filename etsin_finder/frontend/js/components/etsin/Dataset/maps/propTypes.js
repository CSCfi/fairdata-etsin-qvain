import PropTypes from 'prop-types'

export const SpatialPropType = PropTypes.shape({
  wkt: PropTypes.arrayOf(PropTypes.string),
  reference: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }),
})
