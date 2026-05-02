import React from 'react'
import lang from 'lang'

const languageFallbackSupport = {
  writing: lang.t('COMPONENTS.materialInfo.writing'),
  speaking: lang.t('COMPONENTS.materialInfo.speaking')
}

export default function MaterialInfo() {
  return (
    <React.Fragment>
      <h4 className="text-center text-muted">Writing</h4>
      <a href="https://www.b1b2.es/aptis/aptis-writing/" target="_blank" rel="noopener noreferrer">
        <h5 className="text-center text-info">
          <u>{languageFallbackSupport.writing}</u>{' '}
        </h5>
      </a>
      <a href="https://www.b1b2.es/aptis/aptis-speaking/" target="_blank" rel="noopener noreferrer">
        <h4 className="text-center text-muted">Speaking</h4>
        <h5 className="text-center text-info">
          <u>{languageFallbackSupport.speaking}</u>{' '}
        </h5>
      </a>
    </React.Fragment>
  )
}
