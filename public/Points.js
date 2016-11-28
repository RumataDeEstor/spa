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
    this.giveCurPoints = this.giveCurPoints.bind(this);
    this.listener = this.listener.bind(this);
    this.stylizePointsWindow = this.stylizePointsWindow.bind(this);
    this.changeColorOnPointsWindow = this.changeColorOnPointsWindow.bind(this);
  }

  changeColorOnPointsWindow (color) {
    this.refs.small.style.color = color;
    this.refs.oct.style.backgroundColor = color;    
    this.refs.afterSmall.style.borderLeftColor = color;
    this.refs.afterSmall.style.borderRightColor = color;  
    this.refs.beforeBig.style.borderBottomColor = color;
    this.refs.afterBig.style.borderTopColor = color;
    this.refs.beforeSmall.style.borderLeftColor = color;
    this.refs.beforeSmall.style.borderRightColor = color;
  }

  stylizePointsWindow (points) {
    let color = "black";
    if (points > 0) {
      this.refs.small.innerHTML = `+${points}`;
      color = '#27b43e';      
    } else {
      this.refs.small.innerHTML = points;
      color = '#c13d3d';  
    }
    this.changeColorOnPointsWindow(color);    
  }

  listener () {
    // console.log('circle');
    // this.refs.small.style.animationPlayState = "paused";
    this.refs.small.className = "changePointsSmall";
    this.refs.small.innerHTML = "";
    let color = "#e3e3e3";
    this.changeColorOnPointsWindow(color);
  }

  updatePoints(points) {
    let newPoints = +points;
    this.setState({points: this.state.points+newPoints});
    // this.refs.small.style.animationPlayState = "running";
    this.stylizePointsWindow(points);
    this.refs.small.className = "changePointsSmallenabled";
    ee.emitEvent('getPoints', [this.state.points]);
  }

  giveCurPoints(){
    ee.emitEvent('getPoints', [this.state.points]);
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
    this.refs.small.addEventListener("animationend", this.listener, false);
    ee.addListener('reqForPoints', this.giveCurPoints);
    ee.addListener('pointsUpdated', this.updatePoints);
    this.getPoints();
  }

  componentWillUnmount() {
    ee.removeListener('pointsUpdated', this.updatePoints);
    ee.removeListener('reqForPoints', this.giveCurPoints);
  }

  render () {
    return<div className = "userPoints" ref = "points">
            <span className = "beforeOct" ref = "beforeBig"></span>
            <div id="octagon" className = "oct" ref = "oct">
              <span className = "beforeOct" ref = "beforeSmall"> </span>
              <div id="octagonSmall" className = "oct" ref = "octSmall">
                {this.state.points}
              <div className = "changePointsSmall" ref = "small"></div>
              </div>
              <span className = "afterOct" ref = "afterSmall"></span>
            </div>   
            <span className = "afterOct" ref = "afterBig"></span>   
          </div>
  }
}
