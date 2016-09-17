import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

class TaskAddNew extends React.Component {
  constructor(props) {
    super(props);
    this.addNew = this.addNew.bind(this);
    this.clearFields = this.clearFields.bind(this);
  }

  onCancel () {
    contentToHide.style.display  = "none";
  }

  onExpand () {
    contentToHide.style.display  = "flex";
  }

  clearFields() {
    newName.value = "";
    description.value = "";
    newPoints.value = newPoints.defaultValue;
  }

  addNew (){
    let bodyJSON = JSON.stringify({
      name: newName.value,
      description: description.value,
      points: newPoints.value
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
        this.props.onAdding(res.task);
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
            <div id = "contentToHide">
              <div id = "addNewForm">
                <input type = "text" placeholder = "Name" id = "newName"/>
                <textarea id = "description" maxLength = "500" placeholder = "Description..."></textarea>
                <div id = "addNewOpt">
                  <input type = "number" id = "newPoints" defaultValue = "5" min = "0"/>
                  <button id = "add" onClick = {this.addNew}>Add</button>
                  <button id = "cancel" onClick = {this.onCancel}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
  }
}

TaskAddNew.propTypes = {
  onAdding: React.PropTypes.func
};

export default TaskAddNew;
