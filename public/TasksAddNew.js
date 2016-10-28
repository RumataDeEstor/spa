import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
//TODO:forms
export default class TasksAddNew extends React.Component {
  constructor(props) {
    super(props);
    this.addNew = this.addNew.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.checkRepeated = this.checkRepeated.bind(this);
  }

  checkRepeated(e) {
    e.target.className = (e.target.className == "checked") ? "unchecked" : "checked";
  }

  onCancel () {
    addNewForm.style.display = "none";  
    lineExpand.style.display = "flex"; 
  }

  onExpand () {
    addNewForm.style.display  = "flex";
    lineExpand.style.display = "none"; 
  }

  clearFields() {
    newName.value = "";
    newPoints.value = newPoints.defaultValue;
  }

  addNew (){
    let repeated = this.refs.cRep.className == "checked";
    let validPoints = (newPoints.value > 500) ? 500 : newPoints.value;
    let validName = (newName.value.length > 100) ? newName.value.slice(0, 100) : newName.value;

    let bodyJSON = JSON.stringify({
      name: validName,
      points: validPoints,
      repeated: repeated
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
    let projectID = this.props.projectID;
    
    fetch(`/api/userdata/${login}/projects/${projectID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        this.clearFields();
        this.props.onAddingNew(res.task);
      })
      .catch(err => {
        console.log(err);
      })
  }
  render () {
    return <div id = "taskAddNew">
            <div id = "lineExpand">
              <div id = "expand" onClick = {this.onExpand}>+</div>
            </div>            
            <div id = "addNewForm">
              <input type = "text" placeholder = "Name" id = "newName" maxLength = "17"/>
              <div id = "addNewOpt">
                <input type = "number" id = "newPoints" defaultValue = "5" min = "0" max = "500"/>
                <div> repeated: 
                  <div id = "checkBoxRepeated" className = "unchecked" ref = "cRep"
                    onClick = {this.checkRepeated}>
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

TasksAddNew.propTypes = {
  onAddingNew: React.PropTypes.func
};