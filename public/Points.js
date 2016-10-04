import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import ee from './EventEmitter';

export default class Points extends React.Component {
  constructor(props) {
    super(props);
    this.state = {points: null};
    this.getPoints = this.getPoints.bind(this);
    this.updatePoints = this.updatePoints.bind(this);
  }

  updatePoints(newPoints) {
    this.setState({points: this.state.points+newPoints});
    ee.emitEvent('getPoints', [newPoints]);
  }

  getPoints() {
    console.log('get scores');
    let reqParams = {
      method: 'GET',
      credentials: 'include'
    }
    fetch(`/api/userdata/${this.props.login}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        this.setState({points: res.user.points});
        ee.emitEvent('getPoints', [res.user.points]);
      })
      .catch(err => {
        console.log(err);
      })
  }
  
  componentDidMount () {
    ee.addListener('pointsUpdated', this.updatePoints);
    this.getPoints();
  }

  componentWillUnmount() {
    ee.removeListener('pointsUpdated', this.updatePoints);
  }

  render () {
    return <div className = "userPoints">
            Your points:
            {this.state.points}
            </div>
  }
}
