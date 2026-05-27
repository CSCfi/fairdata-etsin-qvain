import styled from 'styled-components'

import MaybeExternalLink from '@/components/general/navigation/maybeExternalLink'
import LumiAifLogoImage from '@/assets/images/LAIF_horizontal_logo_dark.png'

const LumiAifLogoLink = styled(MaybeExternalLink).attrs({
  noPadding: true,
  noMargin: true,
})`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  border: 0;
  box-shadow: none;
  border-radius: 0;
  transition: none;
  &:hover,
  &:focus,
  &:active {
    background: #fff;
    border: 0;
    box-shadow: none;
  }
`

const LumiAifLogo = styled.img`
  height: 2.8rem;
  width: auto;
  display: block;
`

const LumiAifServiceText = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #231f20;
  white-space: nowrap;
  transform: translateY(3px);
`

/** LUMI-AIF co-branding next to the Fairdata Etsin logo in the header. */
const LumiAifHeaderBrand = () => (
  <LumiAifLogoLink to="/">
    <LumiAifLogo src={LumiAifLogoImage} alt="LUMI AIF logo" />
    <LumiAifServiceText>Dataset-as-a-Service</LumiAifServiceText>
  </LumiAifLogoLink>
)

export default LumiAifHeaderBrand
