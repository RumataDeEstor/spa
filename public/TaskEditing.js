import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import ee from './EventEmitter';

//TODO:forms

export default class TaskEditing extends React.Component {
  constructor(props) {
    super(props);
    this.saveChanges = this.saveChanges.bind(this);
    this.onFinishEdit = this.onFinishEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    // setTimeout( () =>{
    //   editForm.style.height = "76px";
    // }, 1);    
  }

  onFinishEdit() {
    // let promise = new Promise (resolve => {
    //   editForm.style.height = "0";
    //   setTimeout( () =>{
    //     ee.emitEvent('taskFinishEdit');
    //     resolve();
    //   }, 200);
    // })
    // return promise;   
    ee.emitEvent('taskFinishEdit');
  }

  onDelete(){
    let reqParams = {
      method: 'DELETE',
      credentials: 'include'
    }

    let login = this.props.login;
    let projID = this.props.projectID;
    let taskID = this.props.target.props.id;

    fetch(`/api/userdata/${login}/projects/${projID}/${taskID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error);
        }
        // this.onFinishEdit().then(res => ee.emitEvent('taskDeleted', [taskID]));  
        ee.emitEvent('taskDeleted', [taskID]);        
      })
      .catch(err => {
        console.log(err);
      })
  }  

  saveChanges () {
    let bodyJSON = JSON.stringify({
      name: editName.value,
      points: editPoints.value
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
    let projID = this.props.projectID;
    let taskID = this.props.target.props.id;
    // fetch(`/api/userdata/${this.props.params.login}`, reqParams)
    fetch(`/api/userdata/${login}/projects/${projID}/${taskID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        let newData = {name: editName.value, points: editPoints.value};
        ee.emitEvent('taskSaveEdit', [taskID, newData]);
        this.onFinishEdit();
      })
      .catch(err => {
        console.log(err);
      })
  }
  render () {
      return<div id = "editForm">
              <input type = "text" defaultValue = {this.props.target.props.name} id = "editName"/>
              <div id = "editOpt">
                <input type = "number" id = "editPoints" defaultValue = {this.props.target.props.points} min = "0" max = "500"/>
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
