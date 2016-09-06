import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

class Tasks extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return <div>
          Tasks!
          {this.props.children}
          </div>
  }
}

export default Tasks;
