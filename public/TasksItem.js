import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import TaskEditing from './TaskEditing';
import ee from './EventEmitter'

export default class TasksItem extends React.Component {
  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);
    this.complete = this.complete.bind(this);
  }
 
  edit() {
    this.props.onEdit(this.props.id); 
  }  

  complete() {
    let bodyJSON = JSON.stringify({
      points: this.props.points
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

    fetch(`/api/userdata/${login}/points`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error);
        }
        ee.emitEvent('pointsUpdated', [this.props.points]);
      })
      .catch(err => {
        console.log(err);
      }) 
  }
  
  render () {
    let component = this.props.editing ? <TaskEditing target = {this} 
        login = {this.props.login}
        projectID = {this.props.projectID}
      /> : null;
      
    return<div>
            <div id = "tasksItem">
              <div id = "taskLine"> 
                <div id = "taskCheckbox" onClick = {this.complete}> complete
                </div>
                <div className = {this.props.label} id = "projectLabel"> 
                </div>
              {this.props.name}
              </div>
              <div id = "points"> {this.props.points} </div>
              <div id = "editItem" className = {this.props.cNameEdit} onClick = {this.edit}>
                <i className="fa fa-pencil-square-o"></i>
              </div>
            </div>
            {component}
          </div>
  }
}

TasksItem.propTypes = {
  onEdit: React.PropTypes.func
};