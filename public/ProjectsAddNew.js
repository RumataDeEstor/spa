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
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }
  render () {
    console.log(this.props.params.login);
    return <div id = "projectsAddNew">
            <div id = "newProjectForm">
              Name: <input id="projName"/>
              Label: <input id="projLabel"/>
              <ol id = "selectLabel" onClick = {this.selectLabel}>
                <li className = "red">RED</li>
                <li className = "blue">BLUE</li>
                <li className = "white">WHITE</li>
                <li className = "green">GREEN</li>
                <li className = "yellow">YELLOW</li>
              </ol>  
              Points: <input id="projPoints" type="number"/>
            </div>
            <button onClick = {this.addNew}>Add</button>
          </div>
  }
}

export default ProjectsAddNew;
