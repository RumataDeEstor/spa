import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
// import ProjectsMenu from './ProjectsMenu';
import Points from './Points';
import ProjectsAddNew from './ProjectsAddNew';
import ProjectsList from './ProjectsList';

class Projects extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return <div id = "projects">
          PROJECTS
          {this.props.children}
          </div>
  }
  // <ProjectsMenu login = {this.props.params.login}/>
  // <Points login = {this.props.params.login} ref='foo'/>
}

export default Projects;
// const childrenWithProps = React.Children.map(this.props.children,
//       (child) => React.cloneElement(child, {
//        doSomething: this.doSomething
//      })
//     );