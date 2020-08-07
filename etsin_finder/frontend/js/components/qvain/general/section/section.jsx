import React, { PureComponent } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import SectionTitle from './title'
import { ExpandCollapse } from './expand'
import QvainTooltip from '../qvainTooltip'

class Section extends PureComponent {
  static propTypes = {
    translations: PropTypes.exact({
      title: PropTypes.string.isRequired,
      tooltip: PropTypes.string.isRequired,
    }).isRequired,
    components: PropTypes.exact({
      tooltipContent: PropTypes.elementType.isRequired,
    }).isRequired,
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.element
    ]).isRequired,
    isRequired: PropTypes.bool,
  }

  static defaultProps = {
    isRequired: false,
  }

  state = {
    isExpanded: false,
  }

  render() {
    const { title, tooltip } = this.props.translations
    const { tooltipContent } = this.props.components
    const { isRequired } = this.props
    const { isExpanded } = this.state

    const handleClick = () => this.setState({ isExpanded: !isExpanded })

    return (
      <div className="container">
        <SectionTitle>
          {isRequired ? null : <ExpandCollapse type="button" isExpanded={isExpanded} onClick={handleClick} />}
          <Translate content={title} onClick={handleClick} />
          <QvainTooltip tooltipAriaLabel={tooltip} tooltipContent={tooltipContent} />
        </SectionTitle>
        {isRequired || isExpanded ? this.props.children : null}
      </div>
    )
  }
}
export default Section
