import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

class ProjectsAddNew extends React.Component {
  constructor(props) {
    super(props);
    this.addNew = this.addNew.bind(this);
    this.clearFields = this.clearFields.bind(this);
  }

  clearFields() {
    newName.value = "";
    chosenColor.className = "white";
  }

  showColors () {
    options.style.width = "150px";
    options.style.borderRight = "1px solid black";  
  }

  hideColors (e) {
    if (e.target.className) {
      chosenColor.className = e.target.className;
    } 
    options.style.width = "0";
    options.style.borderRight = "none"; 
  }

  onCancel () {
    addNewForm.style.height = "0";   
    addNewForm.style.borderBottom = "none";
  }

  onExpand () {
    addNewForm.style.height  = "36px";
    addNewForm.style.borderBottom = "1px solid #424242";
  }

  addNew (){
    let validName = (newName.value.length > 100) ? newName.value.slice(0, 100) : newName.value;
    let bodyJSON = JSON.stringify({
      name: validName,
      label: chosenColor.className
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
    
    fetch(`/api/userdata/${login}/projects/`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        this.clearFields();
        this.props.onAddingNew(res.project);
      })
      .catch(err => {
        console.log(err);
      })
  }
  render () {
    return<div id = "projectsAddNew">
            <div id = "lineExpand">
              <div id = "expand" onClick = {this.onExpand}>+</div>
            </div>
            <div id = "addNewForm">
              <input type = "text" placeholder = "Name" id = "newName" maxLength = "100"/>
              <div id = "addNewOpt">
                <div id = "labelForm">
                  Label:  
                  <div id = "chosen" onClick = {this.showColors}>
                    <div id = "chosenColor" className = "white"></div>
                  </div>  
                  <div id = "options" onClick = {this.hideColors}>
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
                <div id = "buttons">           
                  <button id = "add" onClick = {this.addNew}>Add</button>
                  <button id = "cancel" onClick = {this.onCancel}>Cancel</button>
                </div>  
              </div>
            </div>
          </div>
  }
}

ProjectsAddNew.propTypes = {
  onAddingNew: React.PropTypes.func
};

export default ProjectsAddNew;
