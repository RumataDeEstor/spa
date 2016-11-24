import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import RuleEditing from './RuleEditing'

export default class ProjectsItem extends React.Component {
  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);
    this.open = this.open.bind(this);
    this.showEditBtn = this.showEditBtn.bind(this);
    this.hideEditBtn = this.hideEditBtn.bind(this);
  }

  componentWillReceiveProps(newProps){
    if (newProps.editing) {
      this.refs.itemNorm.style.display = "none";
      return;
    }
    this.refs.itemNorm.style.display = "flex";
  }

  edit() {
    this.props.onEdit(this.props.id);
  }

  showEditBtn(){
    this.refs.eBtn.style.display = "flex";
  }

  hideEditBtn(){
    this.refs.eBtn.style.display = "none";
  }

  open() {
    browserHistory.push(`/app/${this.props.login}/rules/r/${this.props.id}`); 
  }

  render() {
    let component = this.props.editing ? 
      <RuleEditing target = {this} login = {this.props.login}/> : null;
    return<div className = "ruleItem"
            onMouseOver = {this.showEditBtn}
            onMouseOut = {this.hideEditBtn}
          >    
            <div className = "itemNormal" ref = "itemNorm">
              <div className = "checkBoxField">
              </div>
              <div className = "ruleLine" onClick = {this.open}>
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