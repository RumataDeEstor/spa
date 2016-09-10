import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';

class Points extends React.Component {
  constructor(props) {
    super(props);
    this.state = {points: 2};
    this.getScores = this.getScores.bind(this);
  }

  getScores() {
    // let reqParams = {
    //   method: 'GET',
    //   credentials: 'include'
    // }
    // fetch(`/api/userdata/${this.props.params.login}`, reqParams)
    //   .then(res => res.json())
    //   .then(res => {
    //     if (res.error) {
    //       console.log(res.error); // handle;
    //       return;
    //     }
    //     this.setState({points: res.points});
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
  }
  
  componentWillMount () {
    this.getScores();
  }
  render () {
    return <div id = "userPoints">
            Your points:
            {this.state.points}
            </div>
  }
}

export default Points;
