import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route as Public
} from 'react-router-dom'
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore
} from 'react-toasts'
import ScrollMemory from 'react-router-scroll-memory'

import Private from './PrivateRoute'
import NotFound from 'views/errors/404'

import { router as root } from 'router'

const Root = () => {
  return (
    <Router>
      <ToastsContainer
        store={ToastsStore}
        position={ToastsContainerPosition.BOTTOM_CENTER}
        lightBackground
      />
      <ScrollMemory />
      <Switch>
        {root.routes.private.map(props => (
          <Private key={props.path} {...props} />
        ))}
        {root.routes.public.map(props => (
          <Public key={props.path} {...props} />
        ))}
        {(root.development ?? []).map(
          route =>
            import.meta.env.DEV && <Private key={route.path} {...route} />
        )}
        <Public component={NotFound} />
      </Switch>
    </Router>
  )
}

export default Root
