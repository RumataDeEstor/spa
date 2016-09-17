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
  }

  showColors () {
    options.style.display = "flex";
  }

  hideColors (e) {
    if (e.target.className) {
      chosenColor.className = e.target.className;
    } 
    options.style.display = "none";
  }

  onCancel () {
    console.log(contentToHide);
    contentToHide.style.display  = "none";    
  }

  onExpand () {
    console.log(contentToHide);
    contentToHide.style.display  = "flex";    
  }

  addNew (){
    let bodyJSON = JSON.stringify({
      name: newName.value,
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
    
    fetch(`/api/userdata/${login}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
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
            <div id = "contentToHide">
              <div id = "addNewForm">
                <input type = "text" placeholder = "Name" id = "newName"/>
                <div id = "addNewOpt">
                  <div id = "labelForm">
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
