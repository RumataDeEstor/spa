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
    this.hideEditBtn = this.hideEditBtn.bind(this);
    this.showEditBtn = this.showEditBtn.bind(this);
    this.showMark = this.showMark.bind(this);
    this.hideMark = this.hideMark.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount(){
    // if (!this.props.repeated) {
    //   this.refs.rep.style.display = "none";
    // }
  }

  componentWillReceiveProps(newProps){
    if (newProps.editing) {
      this.refs.itemNorm.style.display = "none";
      return;
    }
    this.refs.itemNorm.style.display = "flex";
  }
 
  edit() {
    this.props.onEdit(this.props.id); 
  }  

  showEditBtn(e){
    // console.dir(e.target);
    if (e.target.className == "checkBoxField"||
        e.target.classclassName == "taskCheckbox" ||
        e.target.className == "check") {
      return;
    }
    this.refs.eBtn.style.display = "flex";
  }

  hideEditBtn(){
    this.refs.eBtn.style.display = "none";
  }

  showMark () {
    this.refs.check.style.display = "flex";
  }

  hideMark () {
    this.refs.check.style.display = "none";
  }

  delete(){ // mustn't be repeated with TaskEditing!
    let reqParams = {
      method: 'DELETE',
      credentials: 'include'
    }

    let login = this.props.login;
    let projID = this.props.projectID;
    let taskID = this.props.id;

    fetch(`/api/userdata/${login}/projects/${projID}/${taskID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error);
        }
        // this.onFinishEdit().then(res => ee.emitEvent('taskDeleted', [taskID]));  
        ee.emitEvent('taskDeleted', [taskID]);        
      })
      .catch(err => {
        console.log(err);
      })
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
        if (!this.props.repeated) {
          this.delete();
        }
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
    let rep = this.props.repeated ? <i className="fa fa-repeat" aria-hidden="true"></i>
      : null;
      
    return <div className = "tasksItem"
            onMouseOver = {this.showEditBtn}
            onMouseOut = {this.hideEditBtn}>
              <div className = "itemNormal" ref = "itemNorm">
                <div className = "checkBoxField"
                  onMouseOver = {this.showMark}
                  onMouseOut = {this.hideMark}
                  onClick = {this.complete}>
                  <div className = "taskCheckbox">                     
                    <div className = "check" ref = "check"> ✓ </div>
                  </div>
                </div>
                <div className = "taskLine">                   
                  <div className = "taskName">{this.props.name}</div>
                  <div className = "points"> {this.props.points} </div>
                  <div className = "repeatMark">
                    {rep}
                  </div>
                </div>
                <div id = "editItem" ref = "eBtn" 
                  className = {this.props.cNameEdit} 
                  onClick = {this.edit}>
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