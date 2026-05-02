import React, { memo } from 'react'
import { Tab, Tabs as TabsBootstrap } from 'react-bootstrap'

/**
 * @typedef {Object} ContentProperty
 * @property {string} eventKey
 * @property {string} title
 * @property {React.Component} component
 */

/**
 * @typedef {Object} TabsProps
 * @property {ContentProperty []} content
 * @property {string} defaultKey
 * @property {() => void} onChange
 */

/**
 * @type {React.FunctionComponent<TabsProps>}
 */
const Tabs = ({ content, defaultKey, onChange }) => {

  return (
    <TabsBootstrap activeKey={defaultKey} onSelect={onChange}>
      {content.map(properties => (
        <Tab
          key={properties.eventKey}
          eventKey={properties.eventKey}
          title={properties.title}
        >
          {properties.component}
        </Tab>
      ))}
    </TabsBootstrap>
  )
}

Tabs.defaultProps = {
  content: [],
  onChange: () => null
}

export default memo(Tabs)
