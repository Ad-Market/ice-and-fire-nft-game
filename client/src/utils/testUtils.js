/* eslint-disable no-unused-vars */
import React, {Suspense} from 'react'
import {Provider} from 'react-redux'
// eslint-disable-next-line no-unused-vars
import {Router, Route} from 'react-router-dom'
import {render} from '@testing-library/react'
import {createStore} from 'redux'
import {createMemoryHistory} from 'history'
import rootReducer from '../store/index'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

export function renderWithRedux(
  ui,
  {initialState, store = createStore(rootReducer, initialState)} = {},
) {
  return {
    ...render(
      <Provider store={store}>
          {ui}
      </Provider>,
    ),
  }
}

export function renderWithReduxAndRouter(
  ui,
  {
    route,
    initialState = {},
    history = createMemoryHistory({initialEntries: [route]}),
    store = createStore(rootReducer, initialState),
  } = {},
) {
  return {
    ...render(
      <Provider store={store}>
          <Router history={history}>{ui}</Router>
      </Provider>,
    ),
    history,
  }
}

const middlewares = [thunk]
export const mockStore = configureMockStore(middlewares)
