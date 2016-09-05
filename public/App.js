import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import InternalTopmenu from './InternalTopmenu';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  //todo: DidMount - fetch to check Auth; if not user page, forbidden, redirect.

  render () {
    return <div>
            <InternalTopmenu login = {this.props.params.login}/> 
            APPLICATION
            {this.props.children}
          </div>
  }
}

export default App;
