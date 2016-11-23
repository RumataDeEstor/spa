import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import ee from './EventEmitter';

export default class Pish extends React.Component {
  constructor(props) {
    super(props);
    this.onExpand = this.onExpand.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onCancel () {
    this.refs.addNewForm.style.display = "none";  
    this.refs.lineExpand.style.display = "flex"; 
  }

  onExpand () {
    this.refs.addNewForm.style.display  = "flex";
    this.refs.lineExpand.style.display = "none"; 
  }

  render () {
    return<div className = "ruleAddNew">
            <div className = "lineExpand" ref = "lineExpand">
              <div className = "expand" onClick = {this.onExpand}>+</div>
            </div>
            <div className = "addNewForm" ref = "addNewForm">
              <div style = {{backgroundColor: "transparent"}} className = "projectLabel" ref = "plabel"></div>
              <input type = "text" placeholder = "Name" className = "newName" ref = "newName" maxLength = "17"/>
              <div className = "addNewOpt">
                <div className = "labelForm">
                  <div className = "chosen" onClick = {this.showColors}>
                    <i className="fa fa-tags" aria-hidden="true"></i>
                  </div>  
                  <div className = "options" ref = "options" onClick = {this.hideColors}>
                    <div className = "colorsList" style = {{backgroundColor: "#FF3C3D"}}></div>
                    <div className = "colorsList" style = {{backgroundColor: "#6DC04C"}}></div>
                    <div className = "colorsList" style = {{backgroundColor: "#4591CB"}}></div>
                    <div className = "colorsList" style = {{backgroundColor: "#ECEA48"}}></div>
                    <div className = "colorsList" style = {{backgroundColor: "#BB5FF6"}}></div>
                    <div className = "colorsList" style = {{backgroundColor: "#FFBE58"}}></div>
                    <div className = "colorsList" style = {{backgroundColor: "#FF5BCE"}}></div>
                    <div className = "colorsList" style = {{backgroundColor: "#58C6A0"}}></div>
                    <div className = "colorsList" style = {{backgroundColor: "#676C9A"}}></div>
                  </div>
                </div> 
                <input type = "number" className = "newPoints" 
                  defaultValue = "5" min = "0" max = "500"
                  ref = "newPoints"
                />
                <div className = "buttons">           
                  <button className = "add" onClick = {this.addNew}>Add</button>
                  <button className = "cancel" onClick = {this.onCancel}>Cancel</button>
                </div>  
              </div>
            </div>
          </div>
  }
}
