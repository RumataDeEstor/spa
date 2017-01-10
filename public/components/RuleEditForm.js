import React from 'react'
import { render } from 'react-dom'

export default class RuleEditForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return<div className = "editForm">
            <form ref = "editRuleForm" className = "editRule">
              <div style = {{backgroundColor: this.props.defaultLabel}} 
                className = "projectLabel" 
                ref = "plabel">
              </div>
              <input type = "text" defaultValue = {this.props.defaultName} 
                className = "editName" 
                ref = "editName"
                maxLength = "30"
              />
              <div className = "editOpt">
                <div className = "editLabelForm">
                  <div className = "editChosen">
                    <i className="fa fa-tags" aria-hidden="true"></i>
                  </div>  
                  <div className = "editOptions"ref = "editOptions">
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
                <input type = "number" className = "editPoints" 
                  ref = "editFine"
                  defaultValue = {this.props.defaultFine} 
                  min = "1" max = "500"
                />
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

RuleEditForm.propTypes = {
  // onDelete: React.PropTypes.func
  defaultLabel: React.PropTypes.string,
  defaultName: React.PropTypes.string,
  defaultFine: React.PropTypes.number
};
