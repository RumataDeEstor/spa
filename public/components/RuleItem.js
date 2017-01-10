import React from 'react'
import { render } from 'react-dom'
// import RuleEditing from './RuleEditing'

export default class RuleItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    // let component = this.props.editing ? 
    //   <RuleEditing target = {this} 
    //     login = {this.props.login}
    //     onDelete = {this.hideItem.bind(this)}
    //   /> : null;

    return<div className = "ruleItem"
            ref = "item"
          >    
            <div className = "itemNormal" ref = "itemNorm">
              <div className = "checkBoxField">
                <div className = "taskCheckbox">                     
                  <div className = "check" ref = "check">
                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
              <div className = "ruleLine">
                <div style = {{backgroundColor: this.props.label}} 
                  className = "projectLabel"> 
                </div>
                <div className = "ruleName">{this.props.name}</div>  
                <div className = "fine"> {this.props.fine}</div>
              </div>
              <div id = "editItem" ref = "eBtn">
                <i className="fa fa-pencil-square-o"></i>
              </div> 
            </div>  
          </div>
  }
}

RuleItem.propTypes = {
  // onEdit: React.PropTypes.func
  label: React.PropTypes.string,
  name: React.PropTypes.string,
  fine: React.PropTypes.number
};
