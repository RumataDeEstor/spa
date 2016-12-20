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
    this.getData = this.getData.bind(this);
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
    newPoints = this.state.points+newPoints;
    this.setState({points: newPoints});
    this.stylizePointsWindow(points);
    this.refs.small.className = "changePointsSmallenabled";
    ee.emitEvent('getPoints', [newPoints]);
  }

  giveCurPoints(){
    ee.emitEvent('getPoints', [this.state.points]);
  }

  getPoints() {
    ee.emitEvent('reqForUserdata');
  }

  getData(data) {
    this.setState({points: data.points});
    ee.emitEvent('getPoints', [data.points]);
  }
  
  componentDidMount () {
    this.refs.small.addEventListener("animationend", this.listener, false);
    ee.addListener('reqForPoints', this.giveCurPoints);
    ee.addListener('pointsUpdated', this.updatePoints);
    ee.addListener('giveData', this.getData);
    this.getPoints();
  }

  componentWillUnmount() {
    this.refs.small.removeEventListener("animationend", this.listener, false);
    ee.removeListener('pointsUpdated', this.updatePoints);
    ee.removeListener('reqForPoints', this.giveCurPoints);
    ee.removeListener('giveData', this.getData);
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
