import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import thunkMiddleware from 'redux-thunk'

/**
 * @see https://redux.js.org/api/combinereducers
 */
import root from 'store/reducers'

/**
 * @see https://github.com/redux-saga/redux-saga
 */
const sagaMiddleware = createSagaMiddleware()

/**
 * @see https://redux.js.org/api/createstore
 * @see https://github.com/LogRocket/redux-logger
 * @see https://github.com/reduxjs/redux-thunk
 */
const store = configureStore({
  middleware: [thunkMiddleware, sagaMiddleware],
  preloadedState: {},
  reducer: root,
  devTools: import.meta.env.DEV
})

export function getStore() {
  return store
}

export default store
