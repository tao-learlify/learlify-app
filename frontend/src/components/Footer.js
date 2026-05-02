import React, { memo } from 'react'
import lang from 'lang'
import classNames from 'clsx'
import { useTranslation } from 'react-i18next'

/**
 * Components
 */
import Animate from './Animate'
import Text from './Text'

import 'views/exams/components/css/index.css'
import { isNull } from 'utils/functions'

/**
 * @typedef {Object} Selection
 * @property {boolean} isCorrect
 * @property {string} title
 * @property {string} match
 */

/**
 * @typedef {Object} FooterProps
 * @property {React.Node} children
 * @property {null | boolean} renderValidation
 * @property {Selection} selection
 */

/**
 * @type {React.FunctionComponent<FooterProps>}
 */
const Footer = ({ children, renderValidation, selection, className }) => {
  const { t } = useTranslation()

  if (isNull(renderValidation) && isNull(selection) && className) {
    return (
      <Animate>
        <div className={classNames('footer-style', 'exam-footer', 'mx-0')}>
          <div className={classNames(className)}>{children}</div>
        </div>
      </Animate>
    )
  }

  if (isNull(renderValidation) && isNull(selection)) {
    return (
      <Animate>
        <div className={classNames('footer-style', 'exam-footer', 'mx-0')}>
          <div className="container d-flex justify-content-between align-items-center">
            {children}
          </div>
        </div>
      </Animate>
    )
  }

  return (
    <React.Fragment>
      <Animate>
        <div
          className={classNames(
            'footer-style',
            'exam-footer',
            'mx-0',
            selection ? (selection.isValid ? 'bg-valid' : 'bg-invalid') : ''
          )}
        >
          <div className="container d-flex justify-content-between align-items-center">
            <div className="align-items-center">
              {selection && (
                <>
                  <Text
                    dunkin
                    color={selection.isValid ? 'success' : 'danger'}
                    tag="small"
                  >
                    {lang.t(
                      selection.isValid
                        ? 'EXAMS.feedback.correct'
                        : 'EXAMS.feedback.incorrect'
                    )}
                  </Text>
                  <br />
                  {selection.isValid || (
                    <Text lighter bold color="danger" tag="small">
                      {t('COMPONENTS.FOOTER.match')}: {selection.match}
                    </Text>
                  )}
                </>
              )}
            </div>
            {className ? (
              <div className={classNames(className)}>{children}</div>
            ) : (
              <div>{children}</div>
            )}
          </div>
        </div>
      </Animate>
    </React.Fragment>
  )
}

Footer.defaultProps = {}

export default memo(Footer)
