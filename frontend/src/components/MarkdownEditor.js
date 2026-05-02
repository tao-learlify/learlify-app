import React, { useCallback, memo, useState } from 'react'
import Editor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'
import { TwitterPicker } from 'react-color'

import FlexContainer from './FlexContainer'

/**
 * @type {React.CSSProperties}
 */
const styles = {
  height: 300,
  maxHeight: 300,
  borderRadius: '0.25rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.23)'
}

/**
 * @typedef {Object} MarkdownEditorProps
 * @property {() => void} onChange
 * @property {() => string} onPickColor
 * @property {string} value
 */

const parser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
/**
 * @typedef {React.FunctionComponent<MarkdownEditorProps>}
 */
const MarkdownEditor = ({ value, onChange, onPickColor }) => {
  const [target, setTarget] = useState({
    text: null,
    range: {
      from: 0,
      to: 0
    }
  })

  /**
   * @description
   * Renders the html.
   */
  const render = html => {
    return parser.render(html)
  }

  /**
   * @description
   * Tracks selectionEnd and selectionStart of the editing resource.
   */
  const onSelect = useCallback(
    /**
     * @param {React.TouchEvent<HTMLDivElement>} node
     */
    node => {
      const selectionEnd = node.target.selectionEnd
      const selectionStart = node.target.selectionStart

      setTarget({
        text: node.target.textContent.substring(selectionStart, selectionEnd),
        range: {
          from: selectionStart,
          to: selectionEnd
        }
      })
    },
    []
  )

  /**
   * @description
   * Setting the selected color.
   */
  const onAttatchmentColor = useCallback(
    /**
     * @param {string} color
     */
    color => {
      onPickColor(color, target)
    },
    [onPickColor, target]
  )

  return (
    <React.Fragment>
      <FlexContainer className="p-2">
        <TwitterPicker onChange={onAttatchmentColor} />
      </FlexContainer>
      <div onSelect={onSelect}>
        <Editor
          value={value}
          renderHTML={render}
          onChange={onChange}
          style={styles}
        />
      </div>
    </React.Fragment>
  )
}

MarkdownEditor.defaultProps = {
  value: '',
  onChange: () => null
}

export default memo(MarkdownEditor)
