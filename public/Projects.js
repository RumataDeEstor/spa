import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import ProjectsMenu from './ProjectsMenu'

class Projects extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return <div>
          <ProjectsMenu login = {this.props.params.login}/>
          {this.props.children}
          </div>
  }
}

export default Projects;
