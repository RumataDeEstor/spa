import React from 'react'
import { render } from 'react-dom'
// import TaskEditing from './TaskEditing';

export default class TaskItem extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render () {
    let rep = this.props.repeated ? <i className="fa fa-repeat" aria-hidden="true"></i>
      : null;
      
    return <div className = "taskItem" ref = "item">
              <div className = "itemNormal" ref = "itemNorm">
                <div className = "checkBoxField" ref = "checkContainer">                                 
                  <i className="fa fa-check" aria-hidden="true" 
                    ref = "completeBtn">
                  </i> 
                </div>
                <div className = "taskLine">                   
                  <div className = "taskName">{this.props.name}</div>
                  <div className = "points"> {this.props.points} </div>
                  <div className = "repeatMark">
                    {rep}
                  </div>
                </div>
                <div id = "editItem" ref = "eBtn">
                  <i className="fa fa-pencil-square-o"></i>
                </div>
              </div>
          </div>
  }
}

// TaskItem.propTypes = {
//   onEdit: React.PropTypes.func
// };
TaskItem.propTypes = {
  name: React.PropTypes.string,
  points: React.PropTypes.number,
  repeated: React.PropTypes.bool
};