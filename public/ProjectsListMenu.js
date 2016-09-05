import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

class ProjectsListMenu extends React.Component {
  constructor(props) {
    super(props);
    this.complete = this.complete.bind(this);
  }

  complete () {
    this.props.selected.map(el => {
      console.log(`${el.name} completed!`);
    });
  }

  render () {
    return <div id = "projectsListMenu">
            <ul>
              <li><button>Delete</button></li>
              <li><button onClick = {this.complete}>Complete</button></li>
            </ul>
          </div>
  }
}

export default ProjectsListMenu;
