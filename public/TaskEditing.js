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
    this.checkRepeated = this.checkRepeated.bind(this);
    this.checkForm = this.checkForm.bind(this);
    this.checkName = this.checkName.bind(this);
    this.trimName = this.trimName.bind(this);
  }

  componentDidMount() {
    // setTimeout( () =>{
    //   editForm.style.height = "76px";
    // }, 1);    
    this.refs.editTaskForm.addEventListener('submit', this.checkForm, false);
  }

  checkForm (e) {
    e.preventDefault();
    this.trimName();
    this.normalizePoints();
    if ( this.checkName() ) this.saveChanges();
  }

  trimName () {
    this.refs.editTaskName.value = this.refs.editTaskName.value.trim();
    let validName = (this.refs.editTaskName.value.length > 17) ? 
      this.refs.editTaskName.value.slice(0, 17) : this.refs.editTaskName.value;
    this.refs.editTaskName.value = validName;
  }

  normalizePoints () {
    let points = this.refs.editPoints.value;
    let newPoints = this.refs.editPoints.defaultValue;
    this.refs.editPoints.value = ( (points > 0) && 
      (points < 501) ) ? points : newPoints;  
  }

  checkName () {
    let name = this.refs.editTaskName.value;
    return (/^(\w|\s|[А-Яа-яёЁ])*$/.test(name));   
  }

  onFinishEdit(e) {
    if (e) e.preventDefault();
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

  checkRepeated() {
    this.refs.cRep.className = (this.refs.cRep.className == "checked") ? "unchecked" : "checked";
  }

  onDelete(e){   // mustn't be repeated with TasksItem

    if (e) preventDefault();

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
    let repeated = this.refs.cRep.className == "checked";
   
    let bodyJSON = JSON.stringify({
      name: this.refs.editTaskName.value,
      points: this.refs.editPoints.value,
      repeated: repeated
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
        let newData = {
          name: this.refs.editTaskName.value, 
          points: +this.refs.editPoints.value,
          repeated: repeated
        }; // rewrite
        ee.emitEvent('taskSaveEdit', [taskID, newData]);
        this.onFinishEdit();
      })
      .catch(err => {
        console.log(err);
      })
  }
  render () {
      let isRepeated = this.props.target.props.repeated ? "checked" : "unchecked";
      return<div className = "editForm">
              <form ref = "editTaskForm" className = "editTask">
                <input type = "text" defaultValue = {this.props.target.props.name} 
                  className = "editTaskName"
                  ref = "editTaskName"
                  maxLength = "17"
                />
                <div className = "editOpt">
                  <input type = "number" className = "editPoints" 
                    ref = "editPoints"
                    defaultValue = {this.props.target.props.points} 
                    min = "1" max = "500"
                  />
                  <div id = "editCheckBoxRepeated" 
                    className = {isRepeated}
                    ref = "cRep"
                    onClick = {this.checkRepeated}>
                    <i className="fa fa-repeat" aria-hidden="true"></i>
                  </div>
                  <div className = "editButtons">      
                    <input type = "submit" className = "editSave" value = "Save"/>    
                    <button className = "editFinish" onClick = {this.onFinishEdit}>Cancel</button>
                    <button className = "editDelete" onClick = {this.onDelete}>
                      <i className="fa fa-trash"></i>
                    </button>                  
                  </div>  
                </div>
              </form>
            </div>
  }
}
