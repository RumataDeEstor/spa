import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

export default class NotFound extends React.Component {
  render() {
    return <div>
          404 Not Found
          </div>
  }
}
