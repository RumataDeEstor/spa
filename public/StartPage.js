import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

class StartPage extends React.Component {
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
                <li><IndexLink to="/about">About</IndexLink></li>
              </ul>
            </div>
            {this.props.children}
          </div>
  }
}

const About = () => (
  <div id = "about">
    © Rumata Estorskij, 2016.
  </div>
)

export {StartPage, About};
