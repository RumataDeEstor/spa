import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import ee from './EventEmitter';

export default class RuleAddNew extends React.Component {
  constructor(props) {
    super(props);
    this.addNew = this.addNew.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.hideColors = this.hideColors.bind(this);
    this.showColors = this.showColors.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  clearFields() {
    this.refs.newName.value = "";
    this.refs.plabel.style.backgroundColor = "transparent";
    this.refs.newFine.value = this.refs.newFine.defaultValue;
  }

  showColors () {
    this.refs.options.style.width = "150px"; 
  }

  hideColors (e) {
    if (e.target.className == "colorsList") {
      this.refs.plabel.style.backgroundColor = 
        e.target.style.backgroundColor;
    } 
    this.refs.options.style.width = "0";
  }

  onCancel () {
    this.refs.addNewForm.style.display = "none";  
    this.refs.lineExpand.style.display = "flex"; 
  }

  onExpand () {
    this.refs.addNewForm.style.display  = "flex";
    this.refs.lineExpand.style.display = "none"; 
  }

  addNew (){
    let validName = (this.refs.newName.value.length > 100) ? 
      this.refs.newName.value.slice(0, 100) : this.refs.newName.value;
    let validPoints = (this.refs.newFine.value > 500) ? 
      500 : this.refs.newFine.value;

    let bodyJSON = JSON.stringify({
      name: validName,
      label: this.refs.plabel.style.backgroundColor,
      fine: validPoints
    });
      
    let reqParams = {
      method: 'POST',
      headers: {  
        "Content-type": "application/json; charset=UTF-8"  
      },
      credentials: 'include',
      body: bodyJSON
    }

    let login = this.props.login;
    
    fetch(`/api/userdata/${login}/rules/`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        this.clearFields();
        this.props.onAddingNew(res.rule);
      })
      .catch(err => {
        console.log(err);
      })
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
                  ref = "newFine"
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

RuleAddNew.propTypes = {
  onAddingNew: React.PropTypes.func
};