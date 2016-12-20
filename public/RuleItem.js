import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import RuleEditing from './RuleEditing'
import ee from './EventEmitter'

export default class RuleItem extends React.Component {
  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);
    this.showEditBtn = this.showEditBtn.bind(this);
    this.hideEditBtn = this.hideEditBtn.bind(this);
    this.showMark = this.showMark.bind(this);
    this.hideMark = this.hideMark.bind(this);
    this.breakRule = this.breakRule.bind(this);
    this.hideItem = this.hideItem.bind(this);
  }

  componentWillReceiveProps(newProps){
    if (newProps.editing) {
      this.refs.itemNorm.style.display = "none";
      return;
    }
    this.refs.itemNorm.style.display = "flex";
  }

  hideItem () {
    this.refs.item.style.display = "none";
  }

  showMark () {
    this.refs.check.style.display = "flex";
  }

  hideMark () {
    this.refs.check.style.display = "none";
  }

  edit() {
    this.props.onEdit(this.props.id);
  }

  breakRule () {
    let bodyJSON = JSON.stringify({
      points: -this.props.fine
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

    fetch(`/api/userdata/${login}/points`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error);
        }
        ee.emitEvent('pointsUpdated', [-this.props.fine]);
        ee.emitEvent("update");
      })
      .catch(err => {
        console.log(err);
      }) 
  }

  showEditBtn(){
    this.refs.eBtn.style.display = "flex";
  }

  hideEditBtn(){
    this.refs.eBtn.style.display = "none";
  }

  render() {
    let component = this.props.editing ? 
      <RuleEditing target = {this} 
        login = {this.props.login}
        onDelete = {this.hideItem.bind(this)}
      /> : null;

    return<div className = "ruleItem"
            onMouseOver = {this.showEditBtn}
            onMouseOut = {this.hideEditBtn}
            ref = "item"
          >    
            <div className = "itemNormal" ref = "itemNorm">
              <div className = "checkBoxField"
                  onMouseOver = {this.showMark}
                  onMouseOut = {this.hideMark}
                  onClick = {this.breakRule}>
                <div className = "taskCheckbox">                     
                  <div className = "check" ref = "check">
                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
              <div className = "ruleLine">
                <div style = {{backgroundColor: this.props.label}} 
                  className = "projectLabel"> 
                </div>
                <div className = "ruleName">{this.props.name}</div>  
                <div className = "fine"> {this.props.fine}</div>
              </div>
              <div id = "editItem" ref = "eBtn" className = {this.props.cNameEdit} 
                onClick = {this.edit}>
                <i className="fa fa-pencil-square-o"></i>
              </div> 
            </div>
            {component}    
          </div>
  }
}