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
    this.onCancel = this.onCancel.bind(this);
    this.onExpand = this.onExpand.bind(this);
    this.checkForm = this.checkForm.bind(this);
    this.checkName = this.checkName.bind(this);
    this.trimName = this.trimName.bind(this);
  }

  componentDidMount () {
    this.refs.addTaskForm.addEventListener('submit', this.checkForm, false);
  }

  checkForm (e) {
    e.preventDefault();
    this.trimName();
    this.normalizePoints();
    if ( this.checkName() ) this.addNew();
  }

  trimName () {
    this.refs.newName.value = this.refs.newName.value.trim();
    let validName = (this.refs.newName.value.length > 17) ? 
      this.refs.newName.value.slice(0, 17) : this.refs.newName.value;
    this.refs.newName.value = validName;
  }

  normalizePoints () {
    let points = this.refs.newPoints.value;
    let newPoints = this.refs.newPoints.max;
    this.refs.newPoints.value = ( (points > 0) && 
      (points < 501) ) ? points : newPoints;  
  }

  checkName () {
    let name = this.refs.newName.value;
    return (/^(\w|\s|[А-Яа-яёЁ])*$/.test(name));   
  }

  checkRepeated () {
    this.refs.cRep.className = (this.refs.cRep.className == "checked") ? 
      "unchecked" : "checked";
  }

  onCancel (e) {
    if (e) e.preventDefault();
    this.refs.addNewForm.style.display = "none";  
    this.refs.lineExpand.style.display = "flex"; 
  }

  onExpand () {
    this.refs.addNewForm.style.display  = "flex";
    this.refs.lineExpand.style.display = "none"; 
  }

  clearFields () {
    this.refs.newName.value = "";
    this.refs.newPoints.value = this.refs.newPoints.defaultValue;
  }

  addNew () {
    let repeated = this.refs.cRep.className == "checked";
    let validPoints = this.refs.newPoints.value;
    let validName = this.refs.newName.value;
    // rewrite validation

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
    return <div className = "taskAddNew">
            <div className = "lineExpand" ref = "lineExpand">
              <div className = "expand" onClick = {this.onExpand}>+</div>
            </div>            
            <div className = "addNewForm" ref = "addNewForm">
              <form ref = "addTaskForm" className = "addTask">
                <input type = "text" placeholder = "Name" 
                  className = "newName" maxLength = "17"
                  ref = "newName"
                />
                <div className = "addNewOpt">
                  <input type = "number" className = "newPoints" 
                    defaultValue = "5" min = "1" max = "500"
                    ref = "newPoints"
                  />
                  <div id = "checkBoxRepeated" className = "unchecked" ref = "cRep"
                    onClick = {this.checkRepeated}>
                    <i className="fa fa-repeat" aria-hidden="true"></i>
                  </div>
                  <div className = "buttons">  
                    <input type = "submit" className = "add" value = "Add"/>
                    <button className = "cancel" onClick = {this.onCancel}>Cancel</button>
                  </div>  
                </div>
              </form>
            </div>            
          </div>
  }
}

TasksAddNew.propTypes = {
  onAddingNew: React.PropTypes.func
};