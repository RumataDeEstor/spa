import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

class TasksAddNew extends React.Component {
  constructor(props) {
    super(props);
    this.addNew = this.addNew.bind(this);
    this.clearFields = this.clearFields.bind(this);
  }

  onCancel () {
    addNewForm.style.height = "0";   
    addNewForm.style.borderBottom = "none";
  }

  onExpand () {
    addNewForm.style.height  = "76px";
    addNewForm.style.borderBottom = "1px solid #424242";
  }

  clearFields() {
    newName.value = "";
    newPoints.value = newPoints.defaultValue;
  }

  addNew (){
    let validPoints = (newPoints.value > 500) ? 500 : newPoints.value;
    let validName = (newName.value.length > 100) ? newName.value.slice(0, 100) : newName.value;

    let bodyJSON = JSON.stringify({
      name: validName,
      points: validPoints
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
    
    fetch(`/api/userdata/${login}/${projectID}`, reqParams)
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
              <input type = "text" placeholder = "Name" id = "newName" maxLength = "100"/>
              <div id = "addNewOpt">
                <input type = "number" id = "newPoints" defaultValue = "5" min = "0" max = "500"/>
                <button id = "add" onClick = {this.addNew}>Add</button>
                <button id = "cancel" onClick = {this.onCancel}>Cancel</button>
              </div>
            </div>            
          </div>
  }
}

TasksAddNew.propTypes = {
  onAddingNew: React.PropTypes.func
};

export default TasksAddNew;
