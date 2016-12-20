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
    this.changeBoxShadowColor = this.changeBoxShadowColor.bind(this);
  }

  changeColorOnPointsWindow (color, shadowColor) {
    this.refs.small.style.color = color;
    this.changeBoxShadowColor(shadowColor);
  }

  changeBoxShadowColor (color) {
    this.refs.pContainer.style.boxShadow = `inset 1px 1px 3px 1px ${color}, inset -1px -1px 3px 1px ${color}`;
  }

  stylizePointsWindow (points) {
    let color = "black";
    let shadowColor = "rgba(128,128,128,0.4)";
    if (points > 0) {
      this.refs.small.innerHTML = `+${points}`;
      color = '#27b43e';  
      shadowColor = "rgba(9, 148, 20, 0.76)"; 
    } else {
      this.refs.small.innerHTML = points;
      color = '#c13d3d';  
      shadowColor = "rgba(210, 37, 37, 0.69)";
    }
    this.changeColorOnPointsWindow(color, shadowColor);    
  }

  listener () {
    this.refs.small.className = "changePointsSmall";
    this.refs.small.innerHTML = "";
    let color = "#e3e3e3";
    let shadowColor = "rgba(128,128,128,0.4)";
    this.changeColorOnPointsWindow(color, shadowColor);
  }

  updatePoints(points) {
    let newPoints = +points;
    this.setState({points: this.state.points+newPoints});
    this.stylizePointsWindow(points);
    this.refs.small.className = "changePointsSmallenabled";
    ee.emitEvent('getPoints', [this.state.points]);
  }

  giveCurPoints(){
    ee.emitEvent('getPoints', [this.state.points]);
  }

  getPoints() {
    let reqParams = {
      method: 'GET',
      credentials: 'include'
    }
    fetch(`/api/userdata/${this.props.login}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); 
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
    this.refs.small.removeEventListener("animationend", this.listener, false);
    ee.removeListener('pointsUpdated', this.updatePoints);
    ee.removeListener('reqForPoints', this.giveCurPoints);
  }

  render () {
    return<div className = "userPoints" ref = "points">
            <div className = "pointsContainer" ref = "pContainer">
              <div className = "changePointsSmall" ref = "small"></div>
              {this.state.points}              
            </div>
          </div>
  }
}
