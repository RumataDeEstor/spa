import React from 'react'
import { render } from 'react-dom'
export default class ProjectsAddNew extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return<div className = "projectsAddNew">
            <div className = "lineExpand" ref = "lineExpand">
              <div className = "expand">+</div>
            </div>
            <div className = "addNewForm" ref = "addNewForm">
              <form ref = "addProjectForm" className = "addProject">
                <div style = {{backgroundColor: "transparent"}} className = "projectLabel" ref = "plabel"></div>
                <input type = "text" placeholder = "Name" className = "newName" ref = "newName" maxLength = "17"/>
                <div className = "addNewOpt">
                  <div className = "labelForm">
                    <div className = "chosen">
                      <i className="fa fa-tags" aria-hidden="true"></i>
                    </div>  
                    <div className = "options" ref = "options">
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
                  <div className = "buttons">           
                    <input type = "submit" className = "add" value = "Add"/>
                    <button className = "cancel">Cancel</button>
                  </div>  
                </div>
              </form>              
            </div>
          </div>
  }
}

// ProjectsAddNew.propTypes = {
//   onAddingNew: React.PropTypes.func
// };
