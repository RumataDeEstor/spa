import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import ee from './EventEmitter';

class ProjectEditing extends React.Component {
  constructor(props) {
    super(props);
    this.saveChanges = this.saveChanges.bind(this);
    this.onCancelEdit = this.onCancelEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount(){
    console.log('didmount');
    setTimeout( () =>{
      editForm.style.height = "76px";
    }, 1);    
  }

  onCancelEdit() {
    editForm.style.height = "0";
    setTimeout( () =>{
      ee.emitEvent('cancelEdit');
    }, 200);
  }

  onDelete(){

  }

  showColors () {
    editOptions.style.width = "150px";
    editOptions.style.borderRight = "1px solid black";  
  }

  hideColors (e) {
    if (e.target.className) {
      editChosenColor.className = e.target.className;
    } 
    editOptions.style.width = "0";
    editOptions.style.borderRight = "none"; 
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
    fetch(`/api/userdata/${login}/${projID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        let newData = {name: editName.value, label: editChosenColor.className};
        ee.emitEvent('saveEdit', [projID, newData]);
        this.onCancelEdit();
      })
      .catch(err => {
        console.log(err);
      })
  }
  render () {
    console.log(this.props.target);   
      return<div id = "editForm">
              <input type = "text" defaultValue = {this.props.target.props.name} id = "editName"/>
              <div id = "editOpt">
                <div id = "editLabelForm">
                  Label:  
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
                  <button id = "editCancel" onClick = {this.onCancelEdit}>Cancel</button>
                  <button id = "editDelete" onClick = {this.onDelete}>
                    <i className="fa fa-trash"></i>
                  </button>                  
                </div>  
              </div>
            </div>
  }
}

export default ProjectEditing;
