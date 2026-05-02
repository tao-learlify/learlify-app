import React, { memo, useRef } from 'react'
import Markdown from 'react-markdown'
import styled from 'styled-components'
import Text from 'components/Text'
import { htmlParser } from 'constant'

const Images = styled.img`
  max-width: 100%;
  margin-bottom: 1rem;
  @media screen and (max-width: 420px) {
    width: 100%;
  }
`

/**
 * @typedef {Object} TheoryProps
 * @property {string} heading
 * @property {string []} imageUrl
 * @property {string} subheading
 * @property {string} title
 * @property {'Core' | 'Reading' | 'Speaking' | 'Writing'}
 */

/**
 * @type {React.FunctionComponent<TheoryProps>}
 */
const Theory = ({ heading, imageUrl, subheading, title }) => {
  const markdown = useRef([htmlParser])

  return (
    <React.Fragment>
      {imageUrl && imageUrl.hasOwnProperty('images') ? (
        imageUrl.images.map((image, index) => (
          <Images
            alt="infographic"
            className="border rounded"
            loading="lazy"
            key={index}
            src={image}
          />
        ))
      ) : (
        <React.Fragment>
          <Text color="black" tag="h1">
            {heading}
          </Text>
          <Text color="secondary" tag="h3">
            {title}
          </Text>
          <Markdown
            astPlugins={markdown.current}
            escapeHtml={false}
            source={subheading}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default memo(Theory)
