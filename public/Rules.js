import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import Points from './Points';

class Rules extends React.Component {
  constructor(props) {
    super(props);
  }  
  
  render () {
    return <div>
            My rules
          </div>
  }
}

export default Rules;
