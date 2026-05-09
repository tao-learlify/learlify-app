import React, { memo } from 'react'
import PropTypes from 'prop-types'

import Text from 'components/Text'

const Presentation = ({
  content,
  progressBarTitle,
  subtitle,
  title,
  titleImage,
  withProgress
}) => {
  return (
    <div className="tw:flex tw:flex-wrap">
      {withProgress && (
        <React.Fragment>
          <div className="tw:w-full md:tw:w-4/12 tw:px-4">
            <Text tag="h5" color="muted">
              {progressBarTitle}
            </Text>
          </div>
          <div className="tw:w-full md:tw:w-8/12 tw:px-4">
            <Progress />
          </div>
        </React.Fragment>
      )}
      <div className="tw:w-full md:tw:w-3/12 tw:px-4">
        <img src={titleImage} alt="title" />
      </div>
      <div className="tw:w-full md:tw:w-9/12 tw:px-4">
        <Text tag="h2" color="dark">
          {title}
        </Text>
        <Text tag="h3" color="dark">
          {subtitle}
        </Text>
        <Text tag="p" color="muted">
          {content}
        </Text>
      </div>
    </div>
  )
}

Presentation.propTypes = {
  content: PropTypes.string,
  progressBarTitle: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  titleImage: PropTypes.string,
  withProgress: PropTypes.bool
}

export default memo(Presentation)
