import React, { memo } from 'react'
import { Progress } from 'components/ui'
import { ic_clear } from 'react-icons-kit/md/ic_clear'
import Icon from 'react-icons-kit'
import clsx from 'clsx'

import Emoji from './Emoji'
import Text from './Text'
import BreaklineText from './BreaklineText'
import FlexContainer from './FlexContainer'
import { over } from 'utils/functions'
import { calcProgress } from 'utils/progress'

function RowContainer({ children, className, ...rest }) {
  return <div className={clsx('tw:mt-2.5', className)} {...rest}>{children}</div>
}

/**
 * @typedef {Object} ExamLayoutProps
 * @property {TextColor} color
 * @property {React.Node} children
 * @property {string} description
 * @property {string} emojiName
 * @property {{}} progress
 * @property {TextTag} tag
 * @property {string} textClassName
 * @property {boolean} withBreakline
 * @property {boolean} render
 */

/**
 * @type {React.FunctionComponent<ExamLayoutProps>}
 */
const ExamLayout = ({
  children,
  color,
  description,
  emojiName,
  progress,
  tag,
  textClassName,
  withBreakline,
  onLeave,
  render
}) => (
  <React.Fragment>
    <div className="tw:flex tw:flex-wrap tw:items-center">
      <div className="tw:w-full">
        <div className="d-flex justify-content-center">
          {onLeave && (
            <Icon
              className="text-muted hovered"
              size={24}
              icon={ic_clear}
              onClick={onLeave}
            />
          )}
          <Progress
            className="w-100"
            value={calcProgress(progress.value + 1, progress.limit)}
            label={over(progress.value, progress.limit)}
          />
        </div>
      </div>
    </div>
    {render && (
      <RowContainer>
        <div className="tw:flex tw:flex-wrap">
          <div className="tw:w-full tw:text-center">
            {typeof emojiName === 'object' ? (
              emojiName.nextline ? (
                <FlexContainer>
                  <Emoji {...emojiName} />
                </FlexContainer>
              ) : (
                <Emoji {...emojiName} />
              )
            ) : (
              <Emoji
                className="d-inline mr-3"
                name={emojiName}
                width={400}
                height={40}
              />
            )}
            {withBreakline ? (
              <BreaklineText
                bold
                value={description}
                tag={tag}
                color="gray"
                className={textClassName || 'text-center d-inline'}
              />
            ) : (
              <Text
                bold
                center
                className={textClassName}
                color={color}
                tag={tag}
              >
                {description}
              </Text>
            )}
          </div>
          {children}
        </div>
      </RowContainer>
    )}
  </React.Fragment>
)

ExamLayout.defaultProps = {
  textClassName: 'd-inline',
  color: 'black',
  tag: 'h4',
  render: true
}

export default memo(ExamLayout)
