import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import ee from './EventEmitter';

export default class ProjectEditing extends React.Component {
  constructor(props) {
    super(props);
    this.saveChanges = this.saveChanges.bind(this);
    this.onFinishEdit = this.onFinishEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.hideColors = this.hideColors.bind(this);
    this.showColors = this.showColors.bind(this);
    this.checkForm = this.checkForm.bind(this);
    this.checkName = this.checkName.bind(this);
    this.trimName = this.trimName.bind(this);
  }

  componentDidMount() { 
    this.refs.editProjectForm.addEventListener('submit', this.checkForm, false);
  }

  componentWillUnmount(){
    this.refs.editProjectForm.removeEventListener('submit', this.checkForm, false);
  }

  checkForm (e) {
    e.preventDefault();
    this.trimName();
    if ( this.checkName() ) this.saveChanges();
  }

  checkName(){
    let name = this.refs.editName.value;
    return (/^(\w|\s|[А-Яа-яёЁ]|[.,!-])*$/.test(name));    
  }

  trimName(){
    this.refs.editName.value = this.refs.editName.value.trim();
    let validName = (this.refs.editName.value.length > 17) ? 
      this.refs.editName.value.slice(0, 17) : this.refs.editName.value;
    this.refs.editName.value = validName;
  }

  onFinishEdit(e) {
    if (e) e.preventDefault();
    ee.emitEvent('projectFinishEdit');  
  }

  onDelete(e){
    e.preventDefault();

    this.props.onDelete(); 

    let reqParams = {
      method: 'DELETE',
      credentials: 'include'
    }

    let login = this.props.login;
    let projID = this.props.target.props.id;
    fetch(`/api/userdata/${login}/projects/${projID}`, reqParams)
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

  showColors () {
    this.refs.editOptions.style.width = "150px";    
  }

  hideColors (e) {
    if (e.target.className == "colorsList") {
      this.refs.plabel.style.backgroundColor = 
        e.target.style.backgroundColor;
    } 
    this.refs.editOptions.style.width = "0"; 
  }

  saveChanges () {
    let bodyJSON = JSON.stringify({
      name: this.refs.editName.value,
      label: this.refs.plabel.style.backgroundColor
    });
      
    let reqParams = {
      method: 'PUT',
      headers: {  
        "Content-type": "application/json; charset=UTF-8"  
      },
      credentials: 'include',
      body: bodyJSON
    }

    let login = this.props.login;
    let projID = this.props.target.props.id;

    fetch(`/api/userdata/${login}/projects/${projID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); 
          return;
        }
        let newData = {name: this.refs.editName.value, label: this.refs.plabel.style.backgroundColor};
      
        ee.emitEvent('projectSaveEdit', [projID, newData]);
        this.onFinishEdit();
      })
      .catch(err => {
        console.log(err);
      })
  }
  render () {
      return<div className = "editForm">
              <form className = "editProject" ref = "editProjectForm">
                <div style = {{backgroundColor: this.props.target.props.label}} 
                  className = "projectLabel" 
                  ref = "plabel">
                </div>
                <input type = "text" defaultValue = {this.props.target.props.name} 
                  className = "editName" 
                  ref = "editName"
                  maxLength = "17"
                />
                <div className = "editOpt">
                  <div className = "editLabelForm">
                    <div className = "editChosen" onClick = {this.showColors}>
                      <i className="fa fa-tags" aria-hidden="true"></i>
                    </div>  
                    <div className = "editOptions" onClick = {this.hideColors} ref = "editOptions">
                      <div className = "colorsList" style = {{backgroundColor: "#FF3C3D"}}></div>
                      <div className = "colorsList" style = {{backgroundColor: "#6DC04C"}}></div>
                      <div className = "colorsList" style = {{backgroundColor: "#4591CB"}}></div>
                      <div className = "colorsList" style = {{backgroundColor: "#ECEA48"}}></div>
                      <div className = "colorsList" style = {{backgroundColor: "#BB5FF6"}}></div>
                      <div className = "colorsList" style = {{backgroundColor: "#FFBE58"}}></div>
                      <div className = "colorsList" style = {{backgroundColor: "#FF5BCE"}}></div>
                      <div className = "colorsList" style = {{backgroundColor: "#58C6A0"}}></div>
                      <div className = "colorsList" style = {{backgroundColor: "#676C9A"}}></div>
                    </div>
                  </div> 
                  <div className = "editButtons">           
                    <input type = "submit" className = "editSave" value = "Save"/>
                    <button className = "editFinish" onClick = {this.onFinishEdit}>Cancel</button>
                    <button className = "editDelete" onClick = {this.onDelete}>
                      <i className="fa fa-trash"></i>
                    </button>                  
                  </div>  
                </div>
              </form>
            </div>
  }
}

ProjectEditing.propTypes = {
  onDelete: React.PropTypes.func
};
