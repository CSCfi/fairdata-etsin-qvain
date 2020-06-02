import React, { PureComponent } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import SectionTitle from './section/title'
import { MinusIcon, PlusIcon } from './section/expand'
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
    isRequired: PropTypes.bool,
  }

  static defaultProps = {
    isRequired: false,
  }

  state = {
    isExpanded: false,
  }

  renderExpandButton = () => {
    const { isExpanded } = this.state
    return isExpanded ? <MinusIcon /> : <PlusIcon />
  }

  render() {
    const { title, tooltip } = this.props.translations
    const { tooltipContent } = this.props.components
    const { isRequired } = this.props
    const { isExpanded } = this.state
    return (
      <div className="container">
        <SectionTitle onClick={() => this.setState({ isExpanded: !isExpanded })}>
          {isRequired ? null : this.renderExpandButton()}
          <Translate content={title} />
          <QvainTooltip tooltipAriaLabel={tooltip} tooltipContent={tooltipContent} />
        </SectionTitle>
        {isRequired || isExpanded ? this.props.children : null}
      </div>
    )
  }
}
export default Field
