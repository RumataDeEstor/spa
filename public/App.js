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

  // getScores() {
  //   let reqParams = {
  //     method: 'GET',
  //     credentials: 'include'
  //   }
  //   fetch(`/api/userdata/${this.props.params.login}`, reqParams)
  //     .then(res => res.json())
  //     .then(res => {
  //       if (res.error) {
  //         console.log(res.error); // handle;
  //         return;
  //       }
  //       this.setState({points: res.points});
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     })
  // }
  // //todo: DidMount - fetch to check Auth; if not user page, forbidden, redirect.
  // componentWillMount () {
  //   this.getScores();
  // }
  render () {
    return <div>
            <InternalTopmenu login = {this.props.params.login}/> 
            APPLICATION
            {this.props.children}
          </div>
  }
}

export default App;
