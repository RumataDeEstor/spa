import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

class ProjectsAddNew extends React.Component {
  constructor(props) {
    super(props);
    this.addNew = this.addNew.bind(this);
  }

  selectLabel (e) {
    projLabel.value = e.target.className;
  }

  nameOnFocus(){
    warn.innerHTML = '';
  }

  addNew (){
    let bodyJSON = JSON.stringify({
      name: projName.value,
      label: projLabel.value,
      points: projPoints.value
    });
      
    let reqParams = {
      method: 'POST',
      headers: {  
        "Content-type": "application/json; charset=UTF-8"  
      },
      credentials: 'include',
      body: bodyJSON
    }

    let login = this.props.params.login;
    // fetch(`/api/userdata/${this.props.params.login}`, reqParams)
    fetch(`/api/userdata/${login}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        warn.innerHTML = 'Added!';
        projName.value = '';
        projLabel.value= '';
        projPoints.value = '';
      })
      .catch(err => {
        console.log(err);
      })
  }
  render () {
    return <div id = "projectsAddNew">
            <div id = "newProjectForm">
              Name: <input id="projName" onFocus = {this.nameOnFocus}/>
              Label: <input id="projLabel"/>
              <ol id = "selectLabel" onClick = {this.selectLabel}>
                <li className = "red"></li>
                <li className = "blue"></li>
                <li className = "white"></li>
                <li className = "green"></li>
                <li className = "yellow"></li>
              </ol>  
              Points: <input id="projPoints" type="number"/>
            </div>
            <button onClick = {this.addNew}>Add</button>
            <div id = "warn" className ="warn">
            </div>
          </div>
  }
}

export default ProjectsAddNew;
