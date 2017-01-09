import React, { Component } from 'react'
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import App from './App'

const store = configureStore()

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
      	<Router history={browserHistory}>
      		<Route path="/" component={App} />
    		</Router>
      </Provider>
    )
  }
}