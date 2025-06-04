import styled from 'styled-components'
import PropTypes from 'prop-types'

import importImages from './importImages'
import Image from '@/components/etsin/general/image'

const images = importImages()

const Logo = ({ alt, file, url }) => {
  return (
    <Cont>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Image alt={alt} file={images[file]} />
        </a>
      ) : (
        <Image alt={alt} file={images[file]} />
      )}
    </Cont>
  )
}

Logo.propTypes = {
  alt: PropTypes.string.isRequired,
  file: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

const Cont = styled.div`
  text-align: center;
  padding-top: 1.5rem;
`

export default Logo
