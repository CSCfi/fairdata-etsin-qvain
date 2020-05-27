import React, { PureComponent } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import SectionTitle from './section/title'
import Container from './card'
import QvainTooltip from './qvainTooltip'

class Field extends PureComponent {
  static propTypes = {
    translations: PropTypes.exact({
      title: PropTypes.string.isRequired,
      tooltip: PropTypes.string.isRequired,
    }).isRequired,
    components: PropTypes.exact({
      tooltipContent: PropTypes.elementType.isRequired,
    }).isRequired,
    children: PropTypes.object.isRequired,
  }

  render() {
    const { title, tooltip } = this.props.translations
    const { tooltipContent } = this.props.components
    return (
      <div className="container">
        <SectionTitle>
          <Translate content={title} />
          <QvainTooltip tooltipAriaLabel={tooltip} tooltipContent={tooltipContent} />
        </SectionTitle>
        <Container>{this.props.children}</Container>
      </div>
    )
  }
}
export default Field
