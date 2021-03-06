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
    this.delete = this.delete.bind(this);
    this.tick = this.tick.bind(this);
    this.untick = this.untick.bind(this);
    this.checkMouseOn = this.checkMouseOn.bind(this);
    this.checkMouseOut = this.checkMouseOut.bind(this);
    this.hideItem = this.hideItem.bind(this);
  }

  componentDidMount(){
    this.refs.completeBtn.addEventListener("click", this.complete, false);
  }

  componentWillUnmount(){
    this.refs.completeBtn.removeEventListener("click", this.complete, false);
  }

  componentWillReceiveProps(newProps){
    if (newProps.editing) {
      this.refs.itemNorm.style.display = "none";
      return;
    }
    this.refs.itemNorm.style.display = "flex";
  }

  hideItem () {
    this.refs.item.style.display = "none";
  }

  checkMouseOn(){
    if (this.refs.checkContainer.className == "checkBoxField") {
      this.refs.checkContainer.className = "checkBoxField-hover";
    }
  }

  checkMouseOut(){
    if (this.refs.checkContainer.className == "checkBoxField-hover") {
      this.refs.checkContainer.className = "checkBoxField";
    }
  }
 
  edit() {
    this.props.onEdit(this.props.id); 
  }  

  showEditBtn(e){
    if (e.target.className == "fa fa-check"||
        e.target.classclassName == "checkBoxField-active" ||
        e.target.className == "checkBoxField") {
      return;
    }
    this.refs.eBtn.style.display = "flex";
  }

  hideEditBtn(){
    this.refs.eBtn.style.display = "none";
  }

  tick(){
    let promise = new Promise ((resolve, reject) => {
      this.refs.checkContainer.className = "checkBoxField-active";
      setTimeout(()=> resolve(), 500);
    })
    return promise;
  }

  untick(){
    let promise = new Promise ((resolve, reject) => {
      this.refs.checkContainer.className = "checkBoxField";
      resolve();
    })
    return promise;
  }

  delete() { 
    this.refs.item.style.display = "none";  
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
      })
      .catch(err => {
        console.log(err);
      })
  }  

  complete() {
    if (!this.props.repeated) {
      this.refs.completeBtn.removeEventListener("click", this.complete, false);
      this.tick().then(result => this.delete());
    } else {
      this.tick().then(result => this.untick());
    }

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
        onDelete = {this.hideItem.bind(this)}
      /> : null;
    let rep = this.props.repeated ? <i className="fa fa-repeat" aria-hidden="true"></i>
      : null;
      
    return <div className = "tasksItem" ref = "item"
            onMouseOver = {this.showEditBtn}
            onMouseOut = {this.hideEditBtn}>
              <div className = "itemNormal" ref = "itemNorm">
                <div className = "checkBoxField" ref = "checkContainer">                                 
                  <i className="fa fa-check" aria-hidden="true" 
                    ref = "completeBtn"
                    onMouseOver = {this.checkMouseOn}
                    onMouseOut = {this.checkMouseOut}>
                  </i> 
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