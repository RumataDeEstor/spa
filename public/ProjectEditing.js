import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import ee from './EventEmitter';

export default class ProjectEditing extends React.Component {
  constructor(props) {
    super(props);
    this.saveChanges = this.saveChanges.bind(this);
    this.onFinishEdit = this.onFinishEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    // editForm.style.height = "35px";   
  }

  onFinishEdit() {
    // let promise = new Promise (resolve => {
    //   editForm.style.height = "0";
    //   setTimeout( () =>{
    //     ee.emitEvent('projectFinishEdit');
    //     resolve();
    //   }, 200);
    // })
    // return promise; 
    ee.emitEvent('projectFinishEdit');  
  }

  onDelete(){
    let reqParams = {
      method: 'DELETE',
      credentials: 'include'
    }

    let login = this.props.login;
    let projID = this.props.target.props.id;
    fetch(`/api/userdata/${login}/projects/${projID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error);
        }
        // this.onFinishEdit().then(res => ee.emitEvent('projectDeleted', [projID]));   
        ee.emitEvent('projectDeleted', [projID]);
      })
      .catch(err => {
        console.log(err);
      })
  }

  showColors () {
    editOptions.style.width = "150px";    
  }

  hideColors (e) {
    if (e.target.className) {
      editChosenColor.className = e.target.className;
    } 
    editOptions.style.width = "0"; 
  }

  saveChanges () {
    let bodyJSON = JSON.stringify({
      name: editName.value,
      label: editChosenColor.className
    });
      
    let reqParams = {
      method: 'PUT',
      headers: {  
        "Content-type": "application/json; charset=UTF-8"  
      },
      credentials: 'include',
      body: bodyJSON
    }

    let login = this.props.login;
    let projID = this.props.target.props.id;
    // fetch(`/api/userdata/${this.props.params.login}`, reqParams)
    fetch(`/api/userdata/${login}/projects/${projID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        let newData = {name: editName.value, label: editChosenColor.className};
        //take from server?
        ee.emitEvent('projectSaveEdit', [projID, newData]);
        this.onFinishEdit();
      })
      .catch(err => {
        console.log(err);
      })
  }
  render () {
      return<div id = "editForm">
              <div className = {this.props.target.props.label} id = "projectLabel"></div>
              <input type = "text" defaultValue = {this.props.target.props.name} id = "editName"/>
              <div id = "editOpt">
                <div id = "editLabelForm">
                  <div id = "editChosen" onClick = {this.showColors}>
                    <div id = "editChosenColor" className = {this.props.target.props.label}></div>
                  </div>  
                  <div id = "editOptions" onClick = {this.hideColors}>
                    <div className = "red"></div>
                    <div className = "green"></div>
                    <div className = "blue"></div>
                    <div className = "yellow"></div>
                    <div className = "purple"></div>
                    <div className = "orange"></div>
                    <div className = "violet"></div>
                    <div className = "gray"></div>
                    <div className = "brown"></div>
                  </div>
                </div> 
                <div id = "editButtons">           
                  <button id = "editSave" onClick = {this.saveChanges}>Save</button>
                  <button id = "editFinish" onClick = {this.onFinishEdit}>Cancel</button>
                  <button id = "editDelete" onClick = {this.onDelete}>
                    <i className="fa fa-trash"></i>
                  </button>                  
                </div>  
              </div>
            </div>
  }
}
