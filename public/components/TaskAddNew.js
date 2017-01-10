import React from 'react'
import { render } from 'react-dom'

export default class TaskAddNew extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return <div className = "taskAddNew">
            <div className = "lineExpand" ref = "lineExpand">
              <div className = "expand">+</div>
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
                  <div id = "checkBoxRepeated" className = "unchecked" ref = "cRep">
                    <i className="fa fa-repeat" aria-hidden="true"></i>
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

// TaskAddNew.propTypes = {
//   onAddingNew: React.PropTypes.func
// };