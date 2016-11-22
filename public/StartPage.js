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
              <div className = "logo"><Link to="/"><img src = "/logo/Logo.png"/></Link></div> 
              <ul className = "links">
                <li><IndexLink to="/signup" activeClassName="active">Signup</IndexLink></li>
                <li><IndexLink to="/login" activeClassName="active">Login</IndexLink></li>
              </ul>
            </div>
            {this.props.children}
          </div>
  }
}
