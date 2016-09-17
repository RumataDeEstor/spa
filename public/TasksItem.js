import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import { ee } from './Points'

class TasksItem extends React.Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
    this.complete = this.complete.bind(this);
  }

  delete() {
    let reqParams = {
      method: 'DELETE',
      credentials: 'include'
    }

    let login = this.props.login;
    let projID = this.props.projectID;
    let taskID = this.props.id;

    fetch(`/api/userdata/${login}/${projID}/${taskID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error);
        }
        this.props.onDelete(this.props.id); // tell parent
      })
      .catch(err => {
        console.log(err);
      })
  }
  edit() {
    // this.props.onEdit(this); 
  }  

  // overTheItem() {
  //   this.refs.editBtn.style.display = "flex";
  //   this.isOver = false;
  // }

  // leaveTheItem() {
  //   this.refs.editBtn.style.display = "none";
  // }

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
        // this.props.onComplete(this.props.points); // tell parent
      })
      .catch(err => {
        console.log(err);
      }) 
  }
  
  render () {
    return <div id = "projectsItem">
            <div id = "projectLine"> 
              <div id = "taskCheckbox" onClick = {this.complete}> complete </div>
              <div className = {this.props.label} id = "projectLabel"> 
              </div>
              {this.props.name}
            </div>
            <div id = "points"> {this.props.points} </div>
            <div> 
              <button ref = "editBtn" onClick = {this.edit}> Edit </button>
            </div>
          </div>
  }
}

TasksItem.propTypes = {
  onDelete: React.PropTypes.func,
  onEdit: React.PropTypes.func,
};

export default TasksItem;
