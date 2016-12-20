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
    this.checkForm = this.checkForm.bind(this);
    this.checkName = this.checkName.bind(this);
    this.trimName = this.trimName.bind(this);
  }

  componentDidMount () {
    this.refs.addRuleForm.addEventListener('submit', this.checkForm, false);
  }

  componentWillUnmount () {
    this.refs.addRuleForm.removeEventListener('submit', this.checkForm, false);
  }

  checkForm (e) {
    e.preventDefault();
    this.trimName();
    this.normalizePoints();
    if ( this.checkName() ) this.addNew();
  }

  trimName () {
    this.refs.newName.value = this.refs.newName.value.trim();
    let validName = (this.refs.newName.value.length > 30) ? 
      this.refs.newName.value.slice(0, 30) : this.refs.newName.value;
    this.refs.newName.value = validName;
  }

  normalizePoints () {
    let points = this.refs.newFine.value;
    let fineMax = this.refs.newFine.max;
    this.refs.newFine.value = ( (points > 0) && 
      (points < 501) ) ? points : fineMax;  
  }

  checkName () {
    let name = this.refs.newName.value;
    return (/^(\w|\s|[А-Яа-яёЁ]|[.,!-])*$/.test(name));   
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

  onCancel (e) {
    if (e) e.preventDefault();
    this.clearFields();
    this.refs.addNewForm.style.display = "none";  
    this.refs.lineExpand.style.display = "flex"; 
  }

  onExpand () {
    this.refs.addNewForm.style.display  = "flex";
    this.refs.lineExpand.style.display = "none"; 
  }

  addNew (){
    let validName = this.refs.newName.value;
    let validPoints = this.refs.newFine.value;

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
          console.log(res.error);
          return;
        }
        this.onCancel();
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
              <form ref = "addRuleForm" className = "addRule">
                <div style = {{backgroundColor: "transparent"}} className = "projectLabel" ref = "plabel"></div>
                <input type = "text" placeholder = "Name" className = "newName" 
                  ref = "newName" maxLength = "30"/>
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
                    defaultValue = "5" min = "1" max = "500"
                    ref = "newFine"
                  />
                  <div className = "buttons">       
                    <input type = "submit" className = "add" value = "Add"/>    
                    <button className = "cancel" onClick = {this.onCancel}>Cancel</button>
                  </div>  
                </div>
              </form>
            </div>
          </div>
  }
}

RuleAddNew.propTypes = {
  onAddingNew: React.PropTypes.func
};