import React from 'react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import QvainImage from '../../../../../static/images/qvain_frontpage/qvain.svg'
import EtsinImage from '../../../../../static/images/qvain_frontpage/etsin.svg'
import MeshImage from '../../../../../static/images/qvain_frontpage/mesh.png'
import MeshImage2x from '../../../../../static/images/qvain_frontpage/mesh@2x.png'
import IdaImage from '../../../../../static/images/qvain_frontpage/ida.png'
import IdaImage2x from '../../../../../static/images/qvain_frontpage/ida@2x.png'
import { Box, SideBySide } from './box'

const GraphicsContainer = styled.div``

const Graphics = () => (
  <GraphicsContainer>
    <SideBySide>
      <Box title="IDA" image={IdaImage} image2x={IdaImage2x} arrow style={{ flexGrow: 1.5 }}>
        <Translate content="qvain.home.dataInIda" />
      </Box>
      <Box image={MeshImage} image2x={MeshImage2x} arrow>
        <Translate content="qvain.home.dataInExternal" />
      </Box>
    </SideBySide>
    <Box title="Qvain" image={QvainImage} arrow blue>
      <Translate content="qvain.home.qvainDataset" />
    </Box>
    <Box title="Etsin" image={EtsinImage}>
      <Translate content="qvain.home.etsinSearch" />
    </Box>
  </GraphicsContainer>
)

export default Graphics
