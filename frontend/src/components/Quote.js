import React, { memo } from 'react'
import PropTypes from 'prop-types'

import 'assets/css/Quotes.css'

const PandaUrl = "https://dkmwdxc6g4lk7.cloudfront.net/img/aptisgo-reading-500x500.png"

/**
 * @typedef {Object} QuoteProps
 * @property {string} author
 * @property {string} text
 */

/**
 * @type {React.FunctionComponent<QuoteProps>}
 */
const Quote = ({ text, author }) => {
  return (
    <React.Fragment>
      <blockquote className="fs-md">
        {text}
      </blockquote>
      <cite>
        - {author}
      </cite>
      <img alt="panda" src={PandaUrl} width={300} />
    </React.Fragment>
  )
}

/**
 * @description
 * Defining PropTypes.
 */
Quote.propTypes = {
  author: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

export default memo(Quote)

