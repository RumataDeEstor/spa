import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'

class ProjectEditing extends React.Component {
  constructor(props) {
    super(props);
    this.saveChanges = this.saveChanges.bind(this);
  }

  selectLabel (e) {
    projLabel.value = e.target.className;
  }

  saveChanges () {
    let bodyJSON = JSON.stringify({
      name: projName.value,
      label: projLabel.value,
      points: projPoints.value
    });
      
    let reqParams = {
      method: 'PUT',
      headers: {  
        "Content-type": "application/json; charset=UTF-8"  
      },
      credentials: 'include',
      body: bodyJSON
    }

    let login = this.props.params.login;
    let projID = this.props.id;
    // fetch(`/api/userdata/${this.props.params.login}`, reqParams)
    fetch(`/api/userdata/${login}/${projID}`, reqParams)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          console.log(res.error); // handle;
          return;
        }
        // ?
      })
      .catch(err => {
        console.log(err);
      })
  }
  render () {
    console.log(this.props.params.login);
    return <div id = "projectsAddNew">
            <h2> </h2>
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
            <button onClick = {this.saveChanges}>Save changes</button>
          </div>
  }
}

export default ProjectEditing;
