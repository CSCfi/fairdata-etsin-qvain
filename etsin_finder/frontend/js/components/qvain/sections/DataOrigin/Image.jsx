import styled from 'styled-components'
import PropTypes from 'prop-types'

const Image = ({ src, src2x, disabled }) => {
  const attrs = { src }
  if (src2x) {
    attrs.srcSet = `${src} 1x, ${src2x} 2x`
  }
  return (
    <ImageWrapper disabled={disabled}>
      <img alt="" {...attrs} />
    </ImageWrapper>
  )
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  src2x: PropTypes.string,
  disabled: PropTypes.bool,
}

Image.defaultProps = {
  src2x: undefined,
  disabled: false,
}

const ImageWrapper = styled.div`
  width: 64px;
  height: 65px;
  margin: 0 0.5rem;
  padding: 0;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  > img {
    object-fit: contain;
    filter: grayscale(${p => (p.disabled ? '100%' : '0%')});
    opacity: ${p => (p.disabled ? '25%' : '100%')};
  }
`

export default Image
