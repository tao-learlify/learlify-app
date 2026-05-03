import React, { memo, useRef } from 'react'
import Markdown from 'react-markdown'
import clsx from 'clsx'
import Text from 'components/Text'
import { htmlParser } from 'constant'

function Images({ src, alt, className, ...rest }) {
  return <img className={clsx('tw:max-w-full tw:mb-4 max-[420px]:tw:w-full', className)} src={src} alt={alt} {...rest} />
}

const Theory = ({ heading, imageUrl, subheading, title }) => {
  const markdown = useRef([htmlParser])

  return (
    <React.Fragment>
      {imageUrl && imageUrl.hasOwnProperty('images') ? (
        imageUrl.images.map((image, index) => (
          <Images
            alt="infographic"
            className="tw:border tw:rounded"
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
