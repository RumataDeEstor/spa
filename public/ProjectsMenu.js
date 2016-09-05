import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

class ProjectsMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const path = `/app/${this.props.login}/projects`
    return <div id = "projectsMenu">
            <ul>
              <li><IndexLink to={`${path}/list`}>List</IndexLink></li>
              <li><IndexLink to={`${path}/new`}>Add new</IndexLink></li>
            </ul>
          </div>
  }
}
export default ProjectsMenu;
