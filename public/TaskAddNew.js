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
  }

  selectLabel (e) {
    taskLabel.value = e.target.className;
  }

  addNew (){
    let bodyJSON = JSON.stringify({
      name: taskName.value,
      label: taskLabel.value,
      points: taskPoints.value
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
        taskName.value = '';
        taskLabel.value= '';
        taskPoints.value = '';
        this.props.onAdding(res.task);
      })
      .catch(err => {
        console.log(err);
      })
  }
  render () {
    return <div id = "taskAddNew">
            <div id = "newtaskectForm">
              Name: <input id="taskName"/>
              Label: <input id="taskLabel"/>
              <ol id = "selectLabel" onClick = {this.selectLabel}>
                <li className = "red">RED</li>
                <li className = "blue">BLUE</li>
                <li className = "white">WHITE</li>
                <li className = "green">GREEN</li>
                <li className = "yellow">YELLOW</li>
              </ol>  
              Points: <input id="taskPoints" type="number"/>
            </div>
            <button onClick = {this.addNew}>Add</button>
          </div>
  }
}

TaskAddNew.propTypes = {
  onAdding: React.PropTypes.func
};

export default TaskAddNew;
