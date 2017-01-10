import React from 'react'
import { render } from 'react-dom'

export default class TaskEditForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
      let isRepeated = this.props.repeatedByDefault ? "checked" : "unchecked";
      return<div className = "editForm">
              <form ref = "editTaskForm" className = "editTask">
                <input type = "text" defaultValue = {this.props.defaultName} 
                  className = "editTaskName"
                  ref = "editTaskName"
                  maxLength = "17"
                />
                <div className = "editOpt">
                  <input type = "number" className = "editPoints" 
                    ref = "editPoints"
                    defaultValue = {this.props.defaultPoints} 
                    min = "1" max = "500"
                  />
                  <div id = "editCheckBoxRepeated" 
                    className = {isRepeated}
                    ref = "cRep"
                  >
                    <i className="fa fa-repeat" aria-hidden="true"></i>
                  </div>
                  <div className = "editButtons">      
                    <input type = "submit" className = "editSave" value = "Save"/>    
                    <button className = "editFinish">Cancel</button>
                    <button className = "editDelete">
                      <i className="fa fa-trash"></i>
                    </button>                  
                  </div>  
                </div>
              </form>
            </div>
  }
}

TaskEditForm.propTypes = {
  // onDelete: React.PropTypes..func
  defaultName: React.PropTypes.string,
  defaultPoints: React.PropTypes.number,
  repeatedByDefault: React.PropTypes.bool
};
