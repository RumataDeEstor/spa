import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import ProjectsMenu from './ProjectsMenu';
import Points from './Points';

class Projects extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChildComplete(points){
    console.log('Projects TOP');
    console.log(points);
    this.refs.foo.update();
  }

  render () {
    const childrenWithProps = React.Children.map(this.props.children,
      (child) => {
        if (child.type.name == 'Project') {
          return React.cloneElement(child, {
            onComplete: this.handleChildComplete.bind(this)
          });
        } else return child;
      }
    );
    return <div>
          <Points login = {this.props.params.login} ref='foo'/>
          <ProjectsMenu login = {this.props.params.login}/>
          {childrenWithProps}
          </div>
  }
}

export default Projects;
// const childrenWithProps = React.Children.map(this.props.children,
//       (child) => React.cloneElement(child, {
//        doSomething: this.doSomething
//      })
//     );