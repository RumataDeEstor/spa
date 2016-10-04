import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

export default class StartPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return<div>
            <div className = "topmenu">
              <div id = "logo"><Link to="/">LOGO :)</Link></div> 
              <ul className = "links">
                <li><IndexLink to="/signup">Signup</IndexLink></li>
                <li><IndexLink to="/login">Login</IndexLink></li>
              </ul>
            </div>
            {this.props.children}
          </div>
  }
}
