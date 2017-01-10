import React from 'react';
import { render } from 'react-dom';

export default class RuleAddNew extends React.Component {
  constructor(props) {
    super(props);
  } 

  render () {
    return<div className = "ruleAddNew">
            <div className = "lineExpand" ref = "lineExpand">
              <div className = "expand">+</div>
            </div>
            <div className = "addNewForm" ref = "addNewForm">
              <form ref = "addRuleForm" className = "addRule">
                <div style = {{backgroundColor: "transparent"}} className = "projectLabel" ref = "plabel"></div>
                <input type = "text" placeholder = "Name" className = "newName" 
                  ref = "newName" maxLength = "30"/>
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
                  <input type = "number" className = "newPoints" 
                    defaultValue = "5" min = "1" max = "500"
                    ref = "newFine"
                  />
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

// RuleAddNew.propTypes = {
//   onAddingNew: React.PropTypes.func
// };