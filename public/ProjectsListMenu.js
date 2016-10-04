import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

//USELESS (but --> tasks)
export default class ProjectsListMenu extends React.Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
  }

  delete () {

  }

  render () {
    return <div id = "projectsListMenu">
            <ul>
              <li><button onClick = {this.delete}>Delete</button></li>
            </ul>
          </div>
  }
}