import styled from 'styled-components'
import PropTypes from 'prop-types'

const Image = ({ src, src2x }) => {
  const attrs = { src }
  if (src2x) {
    attrs.srcSet = `${src} 1x, ${src2x} 2x`
  }
  return (
    <ImageWrapper>
      <img alt="" {...attrs} />
    </ImageWrapper>
  )
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  src2x: PropTypes.string,
}

Image.defaultProps = {
  src2x: undefined,
}

const ImageWrapper = styled.div`
  width: 64px;
  height: 65px;
  margin: 0 0.5rem;
  padding: 0;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
  > img {
    object-fit: contain;
  }
`

export default Image
