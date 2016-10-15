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
    this.hideColors = this.hideColors.bind(this);
  }

  clearFields() {
    newName.value = "";
    this.refs.plabel.style.backgroundColor = "#FFFFFF";
  }

  showColors () {
    options.style.width = "150px"; 
  }

  hideColors (e) {
    if (e.target.className == "colorsList") {
      this.refs.plabel.style.backgroundColor = 
        e.target.style.backgroundColor;
    } 
    options.style.width = "0";
  }

  onCancel () {
    addNewForm.style.height = "0";   
    addNewForm.style.borderBottom = "none";
  }

  onExpand () {
    addNewForm.style.height  = "35px";
    addNewForm.style.borderBottom = "1px solid #424242";
  }

  addNew (){
    let validName = (newName.value.length > 100) ? newName.value.slice(0, 100) : newName.value;
    let bodyJSON = JSON.stringify({
      name: validName,
      label: this.refs.plabel.style.backgroundColor
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
              <div style = {{backgroundColor: "#FFFFFF"}} id = "projectLabel" ref = "plabel"></div>
              <input type = "text" placeholder = "Name" id = "newName" maxLength = "100"/>
              <div id = "addNewOpt">
                <div id = "labelForm">
                  <div id = "chosen" onClick = {this.showColors}>
                    <i className="fa fa-tags" aria-hidden="true"></i>
                  </div>  
                  <div id = "options" onClick = {this.hideColors}>
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
