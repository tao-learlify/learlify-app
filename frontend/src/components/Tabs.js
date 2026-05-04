import React, { memo } from 'react'
import { Tabs as TabsUI } from 'components/ui'

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
const TabsComponent = ({ content, defaultKey, onChange }) => {

  return (
    <TabsUI activeKey={defaultKey} onSelect={onChange}>
      {content.map(properties => (
        <TabsUI.Tab
          key={properties.eventKey}
          eventKey={properties.eventKey}
          title={properties.title}
        >
          {properties.component}
        </TabsUI.Tab>
      ))}
    </TabsUI>
  )
}

TabsComponent.defaultProps = {
  content: [],
  onChange: () => null
}

export default memo(TabsComponent)
